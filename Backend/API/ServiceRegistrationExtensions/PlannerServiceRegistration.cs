using API.Models.EmailSettings;
using API.Policies.Handlers;
using API.Repositories.BoardRepository;
using API.Services.Account;
using API.Services.BoardService;
using API.Services.CardService;
using API.Services.EmailService;
using API.Services.ListService;
using API.Services.ProfileService;
using API.Utilities;
using Microsoft.AspNetCore.Authorization;

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
        services.AddScoped<IListService, ListService>();

        // Authorization handlers
        services.AddScoped<IAuthorizationHandler, BoardEditHandler>(); 
        services.AddScoped<IAuthorizationHandler, BoardDeleteHandler>();
        services.AddScoped<IAuthorizationHandler, BoardViewHandler>();

        // Utilities
        services.AddSingleton<TokenProviderUtility>();
        services.AddSingleton<CookiesUtility>(); 

        return services;
    }


    public static IServiceCollection AddEmailServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<EmailSettings>(configuration.GetSection("EmailSettings")); 

        services.AddScoped<IEmailService, EmailService>();  

        return services; 
    }
}
