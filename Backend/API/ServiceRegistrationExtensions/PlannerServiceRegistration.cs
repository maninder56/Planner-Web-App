using API.Models.AppConfigurations;
using API.Models.EmailSettings;
using API.Policies.Handlers;
using API.Repositories.BoardRepository;
using API.Services.Account;
using API.Services.BoardService;
using API.Services.CardService;
using API.Services.EmailService;
using API.Services.InvitationService;
using API.Services.ListService;
using API.Services.ProfileService;
using API.SignalR.BoardPresenceTracker;
using API.SignalR.CardLockTracker;
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
        services.AddScoped<IInvitationService, InvitationService>();

        services.AddSingleton<IBoardPresenceTracker, BoardPresenceTracker>();
        services.AddSingleton<ICardLockTracker, CardLockTracker>();

        // Authorization handlers
        services.AddScoped<IAuthorizationHandler, BoardPermissionHandler>();

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


    public static IServiceCollection AddAppConfigurations(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<FrontEndLinks>(configuration.GetSection("FrontEndLinks"));
        services.Configure<InvitationConfigurations>(configuration.GetSection("InvitationConfigurations")); 

        return services; 
    }
}
