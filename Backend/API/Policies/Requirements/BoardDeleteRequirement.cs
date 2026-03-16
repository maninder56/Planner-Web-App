using DatabaseContext.Types;
using Microsoft.AspNetCore.Authorization;

namespace API.Policies.Requirements; 

public class BoardDeleteRequirement : IAuthorizationRequirement
{
    public BoardDeleteRequirement(params Role[] roles)
    {
        this.Roles = roles;
    }

    public Role[] Roles { get; }
}
