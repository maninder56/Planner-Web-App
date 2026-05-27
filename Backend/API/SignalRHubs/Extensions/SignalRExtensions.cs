using API.SignalRHubs.Hub;

namespace API.SignalRHubs.Extensions; 

public static class SignalRExtensions
{
    public static WebApplication MapPlannerHubs(this WebApplication app)
    {
        app.MapHub<GlobalHub>("/api/hub"); 

        return app; 
    }
}
