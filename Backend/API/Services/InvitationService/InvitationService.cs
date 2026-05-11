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
            User? InvitedUser = await accountRepository.GetUserByEmail(request.InvitedUserEmail);

            if (InvitedUser is null)
            {
                logger.LogWarning("Failed to invite user {Email}; user does not exists", request.InvitedUserEmail);
                return Result.Success();
            }

            // check if user already has access to the board
            BoardMember? boardMember = await boardQueries.GetBoardMemberAsync(InvitedUser.UserId, request.BoardId);

            if (boardMember is not null)
            {
                logger.LogInformation("Invite failed; user {Email} already has access to the board with id {ID} as {AccessLevel}",
                    request.InvitedUserEmail, request.BoardId, boardMember.Role);
                return Result.Failed(ErrorType.Conflict, "User already has access to the board");
            }

            // check if invited user already has an invitation from this board
            Invitation? previousInvitation = await invitationRepository.GetInvitationByBoardAsync(request.InvitedUserEmail, request.BoardId);

            if (previousInvitation is not null && previousInvitation.Status == InvitationStatus.Accepted)
            {
                logger.LogInformation("User {Email} has already accepted invitation from board with id {ID}",
                    request.InvitedUserEmail, request.BoardId);
                return Result.Success();
            }
            else if (previousInvitation is not null && previousInvitation.Status != InvitationStatus.Accepted)
            {
                await invitationRepository.DeleteInvitationAsync(previousInvitation.Id);
            }

            // create new invitation
            await invitationRepository.CreateNewInvitation(new Invitation()
            {
                BoardId = request.BoardId,
                InvitedByUserId = invitedByUserId, 
                InvitedUserId = InvitedUser.UserId,
                InvitedUserEmail = request.InvitedUserEmail,
                Role = request.Role,
                Status = InvitationStatus.Pending, 
                ExpiresAt = DateTime.Now.AddMinutes(invitationConfigurations.ExpirationInMinutes ?? 15),
            }); 

            return Result.Success();

        }
        catch (Exception ex)
        {
            logger.LogWarning("Error occured while creating new invitation, Error Message: {ErrorMessage}", ex.Message);
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
}
