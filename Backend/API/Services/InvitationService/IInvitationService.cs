using API.DTOs.Invitation.Requests;
using API.Models.Result;

namespace API.Services.InvitationService; 

public interface IInvitationService
{
    public Task<Result> InviteUserToBoardAsync(BoardInviteRequest request, int invitedByUserId); 
}
