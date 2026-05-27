using API.DTOs.Invitation.Responses;

namespace API.SignalRHubs.Hub; 

public interface IGlobalHubClient
{
    Task ReceiveInvitationNotification(InvitationInfoResponse invitationInfo);
}
