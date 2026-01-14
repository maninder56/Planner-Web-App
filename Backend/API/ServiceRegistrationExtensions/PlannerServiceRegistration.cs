using API.Services.Account;
using API.Utilities;

namespace API.ServiceRegistrationExtensions; 

public static class PlannerServiceRegistration
{
    public static IServiceCollection AddPlannerServices(this IServiceCollection services)
    {
        // Services 
        services.AddScoped<IAccountService,  AccountService>(); 

        // Utilities
        services.AddSingleton<TokenProviderUtility>();
        services.AddSingleton<CookiesUtility>(); 

        return services;
    }
}
