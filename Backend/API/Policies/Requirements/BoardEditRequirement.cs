using DatabaseContext.Types;
using Microsoft.AspNetCore.Authorization;

namespace API.Policies.Requirements; 

public class BoardEditRequirement : IAuthorizationRequirement 
{
    public BoardEditRequirement(params Role[] roles)
    {
        this.Roles = roles;
    }

    public Role[] Roles { get; }
}
