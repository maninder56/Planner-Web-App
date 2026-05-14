using API.DTOs.Invitation.Requests;
using API.DTOs.Invitation.Responses;
using API.Models.Result;

namespace API.Services.InvitationService; 

public interface IInvitationService
{
    public Task<Result> InviteUserToBoardAsync(BoardInviteRequest request, int invitedByUserId);
    public Task<Result<List<InvitationInfoResponse>>> GetInvitationsReceived(int userId);
    public Task<Result> ProcessInvitationResponseAsync(int invitationId, int invitedUserId, BoardInvitationRespondRequest request); 
}
