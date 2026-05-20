using API.SignalRHubs.Notification;

namespace API.SignalRHubs.Extensions; 

public static class SignalRExtensions
{
    public static WebApplication MapPlannerHubs(this WebApplication app)
    {
        app.MapHub<NotificationHub>("/hubs/notifications"); 

        return app; 
    }
}
