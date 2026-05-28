using API.DTOs.Invitation.Responses;
using API.Models.Account;

namespace API.SignalR.Hub; 

public interface IGlobalHubClient
{
    Task ReceiveInvitationNotification(InvitationInfoResponse invitationInfo);


    Task UserHasJoinedTheBoard(UserInfo userInfo); 
}
