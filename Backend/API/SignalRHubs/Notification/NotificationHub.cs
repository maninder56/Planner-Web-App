using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalRHubs.Notification;

[Authorize]
public class NotificationHub : Hub<INotificationClient>
{
    
}
