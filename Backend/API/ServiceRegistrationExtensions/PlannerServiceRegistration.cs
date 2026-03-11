using API.Repositories.BoardRepository;
using API.Services.Account;
using API.Services.BoardService;
using API.Utilities;

namespace API.ServiceRegistrationExtensions; 

public static class PlannerServiceRegistration
{
    public static IServiceCollection AddPlannerServices(this IServiceCollection services)
    {
        // Services 
        services.AddScoped<IAccountService,  AccountService>(); 
        services.AddScoped<IBoardService,  BoardService>();

        // Utilities
        services.AddSingleton<TokenProviderUtility>();
        services.AddSingleton<CookiesUtility>(); 

        return services;
    }
}
