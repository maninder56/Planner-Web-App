
using API.SignalR.Hub;

namespace API.SignalR.Extensions; 

public static class SignalRExtensions
{
    public static WebApplication MapPlannerHubs(this WebApplication app)
    {
        app.MapHub<GlobalHub>("/api/hub"); 

        return app; 
    }
}
