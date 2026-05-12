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
            var invitationList = await invitationQueries.GetInvitationsInfoByUserId(userId);

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
        // for any of these check when request is accept invitation invitation send bad request
        // check if invitation exits for user with provided id
        // check if invitation is expired
        // cehck if invitation status is revoked
        // check if board exists: send not found as board does not exits now
        // if user is already an member of board but not access role 

        // when user wants to reject invitation
        // if invitation exits or not send : success 
        // if invitation is expired : success 
        // if invitation staus is revoked : sucess 

        // for any of these check send success
        // if user is already an member of board and has same access role
        // if user is not member of the board update boardmember to give user access to the board

    }
}
