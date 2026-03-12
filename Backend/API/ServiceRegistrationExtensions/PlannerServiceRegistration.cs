using API.Repositories.BoardRepository;
using API.Services.Account;
using API.Services.BoardService;
using API.Services.CardService;
using API.Services.ProfileService;
using API.Utilities;

namespace API.ServiceRegistrationExtensions; 

public static class PlannerServiceRegistration
{
    public static IServiceCollection AddPlannerServices(this IServiceCollection services)
    {
        // Services 
        services.AddScoped<IAccountService,  AccountService>(); 
        services.AddScoped<IBoardService,  BoardService>();
        services.AddScoped<ICardService, CardService>();
        services.AddScoped<IProfileService, ProfileService>();

        // Utilities
        services.AddSingleton<TokenProviderUtility>();
        services.AddSingleton<CookiesUtility>(); 

        return services;
    }
}
