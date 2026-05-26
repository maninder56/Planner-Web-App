using API.DTOs.Invitation.Responses;

namespace API.SignalRHubs.Notification; 

public interface INotificationClient
{
    Task ReceiveInvitationNotification(InvitationInfoResponse invitationInfo);
}
