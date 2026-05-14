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
                new BoardPermissionRequirement(Role.Owner, Role.Member, Role.Viewer)
                ));  

        options.AddPolicy(
        "CanEditBoard",
        policyBuilder => policyBuilder.AddRequirements(
            new BoardPermissionRequirement(Role.Owner, Role.Member)
            ));

        options.AddPolicy(
            "CanDeleteBoard",
            policyBuilder => policyBuilder.AddRequirements(
                new BoardPermissionRequirement(Role.Owner)
                ));

        options.AddPolicy(
            "CanShareBoard",
            policyBuilder => policyBuilder.AddRequirements(
                new BoardPermissionRequirement(Role.Owner)
                )); 

        return options; 
    }
}
