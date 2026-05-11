using DatabaseContext.Types;
using Microsoft.AspNetCore.Authorization;

namespace API.Policies.Requirements; 

public class BoardPermissionRequirement : IAuthorizationRequirement
{
    public BoardPermissionRequirement(params Role[] roles)
    {
        Roles = roles;
    }

    public Role[] Roles { get; }
}
