using API.Policies.Requirements;
using DatabaseContext.Types;
using Microsoft.AspNetCore.Authorization;
using System.Net;

namespace API.ServiceRegistrationExtensions; 

public static class AuthorizationServiceRegistration
{
    public static AuthorizationOptions AddAuthorizationPolicies(this AuthorizationOptions options)
    {
        options.AddPolicy(
            "CanViewBoard",
            policyBuilder => policyBuilder.AddRequirements(
                new BoardViewRequirement(Role.Owner, Role.Member, Role.Viewer)
                ));  

        options.AddPolicy(
        "CanEditBoard",
        policyBuilder => policyBuilder.AddRequirements(
            new BoardEditRequirement(Role.Owner, Role.Member)
            ));

        options.AddPolicy(
            "CanDeleteBoard",
            policyBuilder => policyBuilder.AddRequirements(
                new BoardDeleteRequirement(Role.Owner)
                ));

        return options; 
    }
}
