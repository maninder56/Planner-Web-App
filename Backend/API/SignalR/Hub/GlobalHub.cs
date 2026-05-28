using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR.Hub;

[Authorize]
public class GlobalHub : Hub<IGlobalHubClient>
{

}
