using API.DTOs.Invitation.Requests;
using API.DTOs.Invitation.Responses;
using API.Models.AppConfigurations;
using API.Models.Result;
using API.Queries.Boards;
using API.Queries.Invitations;
using API.Repositories.Account;
using API.Repositories.BoardRepository;
using API.Repositories.InvitationRepository;
using DatabaseContext;
using DatabaseContext.Types;
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
    IOptions<InvitationConfigurations> invitationOptions 
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


            // check if latest pending invitation
            var latestPendingInvitation = await invitationRepository.GetLatestPendingInvitationAsync(invitedUser.UserId, request.BoardId); 

            if (latestPendingInvitation is null)
            {
                // create new invitation
                await invitationRepository.CreateNewInvitation(newInvitation);
                return Result.Success();
            }
            else if (latestPendingInvitation.ExpiresAt < DateTime.Now)
            {
                // delete all pending invitations and add new invitation
                await invitationRepository.InvalidatePreviousPendingInvitationsAsync(invitedUser.UserId, request.BoardId);
                await invitationRepository.CreateNewInvitation(newInvitation);
                return Result.Success();
            }
            else if (latestPendingInvitation.CreatedAt > DateTime.Now.AddMinutes(-5))
            {
                // user can not send multiple invitation one after another
                logger.LogInformation("User with id {UserID} has sent another invitation within 5 min; which is not allowed",
                    invitedByUserId);
                return Result.Success();
            }
            else
            {
                logger.LogInformation("User {Email} have pending invitation from board with id {ID}",
                    request.InvitedUserEmail, request.BoardId);
                return Result.Success();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex,"Error occured while creating new invitation for board {BoardId}",
                request.BoardId);
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


    public async Task<Result> HandleUserRespondToInvitation(int invitationId, int invitedUserId, BoardInvitationRespondRequest request)
    {
        var invitation = await invitationRepository.GetPendingInvitationByIdAsync(invitationId);

        if (invitation is null)
        {
            logger.LogWarning("Invitation with ID {InvitationID} does not exists", invitationId); 
            return Result.Failed(ErrorType.BadRequest, "Invalid Invitation"); 
        }
        else if (invitation.InvitedUserId != invitedUserId)
        {
            logger.LogWarning("Invitation with ID {InvitationID} does not belong to user with ID {UserID}",
                invitationId, invitedUserId); 
            return Result.Failed(ErrorType.BadRequest, "Invalid Invitation");
        }
        else if (invitation.ExpiresAt < DateTime.Now)
        {
            logger.LogWarning("Invitation with ID {InvitationID} expired",invitationId);
            return Result.Failed(ErrorType.BadRequest, "Invalid Invitation");
        }

        if (request.Status == InvitationStatus.Rejected)
        {
            await invitationRepository.UpdateInvitationStatusByIdAsync(invitationId, InvitationStatus.Rejected);
            await invitationRepository.InvalidatePreviousPendingInvitationsAsync(invitedUserId, invitation.BoardId); 
            return Result.Success();
        }

        if (request.Status != InvitationStatus.Accepted)
        {
            logger.LogWarning("Invitation can only be accepted or rejected; {Status} was provided for invitation id {ID} for invited user id {ID}", 
                request.Status, invitationId, invitedUserId);
            return Result.Failed(ErrorType.BadRequest, "Invalid request"); 
        }

        // check if board exists 
        Board? board = await boardQueries.GetBoardByIdAsync(invitation.BoardId);
        if (board is null)
        {
            logger.LogWarning("Board in which user was invited does not exists"); 
            return Result.Failed(ErrorType.NotFound, "Board does not exists"); 
        }

        // check if user exists
        User? user = await accountRepository.GetUserById(invitedUserId);
        if (user is null)
        {
            logger.LogWarning("User {ID} does not exists", invitedUserId);
            return Result.Failed(ErrorType.BadRequest, "Invalid User");
        }


        // check if user already has access to the board
        BoardMember? boardMember = await boardQueries.GetBoardMemberAsync(invitedUserId, invitation.BoardId);

        if (boardMember is null)
        {
            // create new board member
            await boardRepository.CreateNewBoardMemberAsync(invitedUserId, invitation.BoardId, invitation.Role);
            await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id, InvitationStatus.Accepted);
            await invitationRepository.InvalidatePreviousPendingInvitationsAsync(invitedUserId, invitation.BoardId);
            return Result.Success();
            
        }
        else if (boardMember.Role == invitation.Role)
        {
            logger.LogInformation("User is already a member of board {BoardID} and has same role {Role}",
                invitation.BoardId, invitation.Role);
            await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id, InvitationStatus.Accepted);
            await invitationRepository.InvalidatePreviousPendingInvitationsAsync(invitedUserId, invitation.BoardId);
            return Result.Success();
        } 
        else if (invitation.Role == Role.Member)
        {
            // update board member role
            await boardRepository.UpdateBoardMemberRoleAsync(invitedUserId, invitation.BoardId, invitation.Role);
            await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id, InvitationStatus.Accepted);
            await invitationRepository.InvalidatePreviousPendingInvitationsAsync(invitedUserId, invitation.BoardId);
            return Result.Success();
        }
        else
        {
            // can not change access level from higher lower
            logger.LogWarning(
                "Can not change user's access level to lower then current access level; current access level: {CurrentAccessLevel}, requested access level: {requestedAccessLevel}", 
                boardMember.Role, invitation.Role); 
            await invitationRepository.UpdateInvitationStatusByIdAsync(invitation.Id,InvitationStatus.Accepted);
            await invitationRepository.InvalidatePreviousPendingInvitationsAsync(invitedUserId, invitation.BoardId);
            return Result.Success(); 
        }

    }
}
