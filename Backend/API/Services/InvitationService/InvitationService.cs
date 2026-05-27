using API.DTOs.Invitation.Requests;
using API.DTOs.Invitation.Responses;
using API.Models.AppConfigurations;
using API.Models.Result;
using API.Queries.Boards;
using API.Queries.Invitations;
using API.Repositories.Account;
using API.Repositories.BoardRepository;
using API.Repositories.InvitationRepository;
using API.SignalRHubs.Hub;
using DatabaseContext;
using DatabaseContext.Types;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.Options;
using System.Data;

namespace API.Services.InvitationService; 

public class InvitationService(
    ILogger<InvitationService> logger,
    IAccountRepository accountRepository, 
    IInvitationRepository invitationRepository, 
    IBoardRepository boardRepository,
    InvitationQueries invitationQueries, 
    BoardQueries boardQueries, 
    PlannerContext plannerContext,
    IOptions<InvitationConfigurations> invitationOptions, 
    IHubContext<GlobalHub, IGlobalHubClient> globalHubContext
    ) : IInvitationService
{
    private readonly InvitationConfigurations invitationConfigurations = invitationOptions.Value;

    public async Task<Result> InviteUserToBoardAsync(BoardInviteRequest request, int invitedByUserId)
    {
        try
        {
            // validate if invited user exists 
            User? invitedUser = await accountRepository.GetUserByEmail(request.InvitedUserEmail);
            if (invitedUser is null)
            {
                logger.LogWarning("Failed to invite user {Email}; user does not exists", request.InvitedUserEmail);
                return Result.Success();
            }

            // check if user already has access to the board
            BoardMember? boardMember = await boardQueries.GetBoardMemberAsync(invitedUser.UserId, request.BoardId);

            if (boardMember is not null)
            {
                logger.LogInformation("Invite failed; user {Email} already has access to the board with id {ID} as {AccessLevel}",
                    request.InvitedUserEmail, request.BoardId, boardMember.Role);
                return Result.Failed(ErrorType.Conflict, "User already has access to the board");
            }

            Invitation newInvitation = new Invitation()
            {
                BoardId = request.BoardId,
                InvitedByUserId = invitedByUserId,
                InvitedUserId = invitedUser.UserId,
                InvitedUserEmail = request.InvitedUserEmail,
                Role = request.Role,
                Status = InvitationStatus.Pending,
                ExpiresAt = DateTime.Now.AddMinutes(invitationConfigurations.ExpirationInMinutes ?? 15),
            };

            return await ProcessInvitationCreationAsync(newInvitation, invitedUser.UserId, invitedByUserId); 

        }
        catch (Exception ex)
        {
            logger.LogError(ex,"Error occured while creating new invitation for board {BoardId}",
                request.BoardId);
            return Result.Failed(ErrorType.InternalServerError, "An Unexpected error occured");
        }
    }

    private async Task<Result> ProcessInvitationCreationAsync(Invitation newInvitation, int invitedUserId, int invitedByUserId)
    {
        try
        {
            // check if latest pending invitation
            var latestPendingInvitation = await invitationRepository.GetLatestPendingInvitationAsync(invitedUserId, newInvitation.BoardId);

            if (latestPendingInvitation is not null && latestPendingInvitation.CreatedAt > DateTime.Now.AddMinutes(-5))
            {
                // user can not send multiple invitation one after another
                logger.LogInformation("Skipped invitation creation because a recent pending invitation created at {CreatedAt} already exists; send by User with id {UserID}",
                    latestPendingInvitation.CreatedAt, invitedByUserId);
                return Result.Failed(ErrorType.TooManyRequests, "Too many invitations sent withing 5 min");
            }
            
            // start transaction
            await using var transaction = await plannerContext.Database.BeginTransactionAsync();

            // invalidate all pending invitations and add new invitation
            await invitationRepository.InvalidatePreviousPendingInvitationsAsync(invitedUserId, newInvitation.BoardId);
            Invitation createdInvitation = await invitationRepository.CreateNewInvitation(newInvitation);
            await transaction.CommitAsync();
            
            var boardName = await boardQueries.GetBoardNameAsync(createdInvitation.BoardId);

            // Send user notification
            await globalHubContext.Clients.User(invitedUserId.ToString()).ReceiveInvitationNotification(new InvitationInfoResponse
            {
                Id = createdInvitation.Id, 
                BoardId = createdInvitation.BoardId, 
                BoardName = boardName ?? "-",
                InvitedByUserEmail = createdInvitation.InvitedUserEmail,
                Role = createdInvitation.Role,
                Status = createdInvitation.Status,
                ExpiresAt = createdInvitation.ExpiresAt,
            });

            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occured while creating new invitation for board {BoardId}",
                newInvitation.BoardId);
            return Result.Failed(ErrorType.InternalServerError, "An Unexpected error occured");
        }
    }


    public async Task<Result<List<InvitationInfoResponse>>> GetInvitationsReceived(int userId)
    {
        try
        {
            var invitationList = await invitationQueries.GetValidPendingInvitationsInfoByUserId(userId);

            return Result<List<InvitationInfoResponse>>.Success(invitationList);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Error occured while getting invitations, Error Message: {ErrorMessage}", ex.Message);
            return Result<List<InvitationInfoResponse>>.Failed(ErrorType.InternalServerError, "An Unexpected error occured");
        }
    }


    public async Task<Result> ProcessInvitationResponseAsync(int invitationId, int invitedUserId, BoardInvitationRespondRequest request)
    {
        try
        {
            // Validate request
            if (request.Status is not InvitationStatus.Rejected && request.Status is not InvitationStatus.Accepted)
            {
                logger.LogWarning("Invitation can only be accepted or rejected; {Status} was provided for invitation id {ID} for invited user id {ID}",
                    request.Status, invitationId, invitedUserId);
                return Result.Failed(ErrorType.BadRequest, "Invalid request");
            }

            // Validate Invitation
            var invitationValidationResult = await ValidateInvitationAsync(invitationId, invitedUserId);
            Invitation? invitation = invitationValidationResult.Data;

            if (!invitationValidationResult.Successful)
            {
                return Result.Failed(invitationValidationResult.Error.Type, invitationValidationResult.Error.Title);
            }
            
            if (invitation is null)
            {
                return Result.Failed(ErrorType.InternalServerError, "Unexpected error"); 
            }

            // Handle rejection
            if (request.Status == InvitationStatus.Rejected)
            {
                return await RejectInvitationAsync(invitation, invitedUserId);
            }

            // check if board exists 
            var validUserAndBoardResult = await ValidateUserAndBoardAsync(invitedUserId, invitation); 

            if (!validUserAndBoardResult.Successful)
            {
                return validUserAndBoardResult; 
            }


            // Handle acceptance
            return await AcceptInvitationAsync(invitation, invitedUserId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex,
                "Error occured while handling invitation respond for invitation id {ID}",
                invitationId);
            return Result.Failed(ErrorType.InternalServerError, "An Unexpected error occured");
        }    
    }


    private async Task<Result<Invitation>> ValidateInvitationAsync(int invitationId, int invitedUserId)
    {
        var invitation = await invitationRepository.GetPendingInvitationByIdAsync(invitationId);

        if (invitation is null)
        {
            logger.LogWarning("Invitation with ID {InvitationID} does not exists", invitationId);
            return Result<Invitation>.Failed(ErrorType.BadRequest, "Invalid Invitation");
        }
        else if (invitation.InvitedUserId != invitedUserId)
        {
            logger.LogWarning("Invitation with ID {InvitationID} does not belong to user with ID {UserID}",
                invitationId, invitedUserId);
            return Result<Invitation>.Failed(ErrorType.BadRequest, "Invalid Invitation");
        }
        else if (invitation.ExpiresAt < DateTime.Now)
        {
            logger.LogWarning("Invitation with ID {InvitationID} expired", invitationId);
            await invitationRepository.UpdateInvitationStatusByIdAsync(invitationId, InvitationStatus.Expired);
            return Result<Invitation>.Failed(ErrorType.BadRequest, "Invalid Invitation");
        }
        else
        {
            return Result<Invitation>.Success(invitation); 
        }
    }

    private async Task<Result> RejectInvitationAsync(Invitation invitation, int invitedUserId)
    {
        try
        {
            await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id, InvitationStatus.Rejected); 

            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogError(ex,"Error occured while rejecting invitation with id {ID}",invitation.Id);
            return Result.Failed(ErrorType.InternalServerError, "An Unexpected error occured");
        }
    }

    private async Task<Result> AcceptInvitationAsync(Invitation invitation, int invitedUserId)
    {
        try
        {
            // check if user already has access to the board
            BoardMember? boardMember = await boardQueries.GetBoardMemberAsync(invitedUserId, invitation.BoardId);

            // start transaction
            await using var transaction = await plannerContext.Database.BeginTransactionAsync();

            if (boardMember is null)
            {
                // create new board member
                await boardRepository.CreateNewBoardMemberAsync(invitedUserId, invitation.BoardId, invitation.Role);
                await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id, InvitationStatus.Accepted); 
            }
            else if (boardMember.Role.IsEqualTo(invitation.Role))
            {
                logger.LogInformation("User is already a member of board {BoardID} and has same role {Role}",
                    invitation.BoardId, invitation.Role);
                await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id, InvitationStatus.Accepted);
            }
            else if (invitation.Role.HasHigherPrivilegeThan(boardMember.Role))
            {
                // access level can be changed to higher level
                await boardRepository.UpdateBoardMemberRoleAsync(invitedUserId, invitation.BoardId, invitation.Role);
                await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id, InvitationStatus.Accepted);
            }
            else
            {
                // can not change access level from higher lower
                logger.LogWarning(
                    "Can not change user's access level to lower then current access level; current access level: {CurrentAccessLevel}, requested access level: {requestedAccessLevel}",
                    boardMember.Role, invitation.Role);
                await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id, InvitationStatus.Invalidated);
            }

            await invitationRepository.InvalidatePreviousPendingInvitationsAsync(invitedUserId, invitation.BoardId);
            await transaction.CommitAsync();
            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogError(ex,
                "Error occured while accepting invitation with id {ID}",
                invitation.Id);
            return Result.Failed(ErrorType.InternalServerError, "An Unexpected error occured");
        }
    }


    private async Task<Result> ValidateUserAndBoardAsync(int invitedUserId, Invitation invitation)
    {
        // check if board exists 
        Board? board = await boardQueries.GetBoardByIdAsync(invitation.BoardId);
        if (board is null)
        {
            logger.LogWarning("Board {BoardId} referenced by invitation {InvitationId} does not exist",
                invitation.BoardId, invitation.Id);
            await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id, InvitationStatus.Revoked);
            return Result.Failed(ErrorType.NotFound, "Board does not exists");
        }

        // check if user exists
        User? user = await accountRepository.GetUserById(invitedUserId);
        if (user is null)
        {
            logger.LogWarning("User {ID} does not exists", invitedUserId);
            await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id, InvitationStatus.Revoked);
            return Result.Failed(ErrorType.BadRequest, "Invalid User");
        }

        return Result.Success();
    }

}
