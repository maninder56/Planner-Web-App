using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalRHubs.Hub;

[Authorize]
public class GlobalHub : Hub<IGlobalHubClient>
{

}
