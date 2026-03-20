using DatabaseContext.Types;
using Microsoft.AspNetCore.Authorization;

namespace API.Policies.Requirements; 

public class BoardViewRequirement : IAuthorizationRequirement
{
    public BoardViewRequirement(params Role[] roles)
    {
        this.Roles = roles;
    }

    public Role[] Roles { get; }
}
