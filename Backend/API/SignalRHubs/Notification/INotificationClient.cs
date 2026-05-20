namespace API.SignalRHubs.Notification; 

public interface INotificationClient
{
    Task ReceiveNotification(string message);
}
