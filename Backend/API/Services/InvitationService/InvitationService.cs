using API.DTOs.Invitation.Requests;
using API.Models.Result;

namespace API.Services.InvitationService; 

public class InvitationService : IInvitationService
{
    public async Task<Result> InviteUserToBoardAsync(BoardInviteRequest request)
    {
        // validate if invited user exists 

        // check if user already has access to the board
        // if user has access to the board let user know send 409 conflict status code

        // check if invited user already has an invitation from this board
        // if user has been invited then override with new invitation and set status to pending
        // else create new invitation
        

        throw new NotImplementedException();
    }
}
