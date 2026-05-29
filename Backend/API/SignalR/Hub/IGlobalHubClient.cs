using API.DTOs.Invitation.Responses;
using API.DTOs.User.Responses;
using API.Models.Account;

namespace API.SignalR.Hub; 

public interface IGlobalHubClient
{
    Task ReceiveInvitationNotification(InvitationInfoResponse invitationInfo);


    Task UserHasJoinedTheBoard(UserJoiningInfoResponse userInfo);
    Task UserHasLeftTheBoard(UserLeavingInfoResponse userInfo);
}
