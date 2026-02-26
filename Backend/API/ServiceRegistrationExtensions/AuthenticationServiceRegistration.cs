using API.Models.Cookies.Type;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text; 

namespace API.ServiceRegistrationExtensions;

public static class AuthenticationServiceRegistration
{
    public static IServiceCollection AddJWTBearerAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        bool requireHttpsMetadata = configuration["ASPNETCORE_ENVIRONMENT"] == "Production";

        string secretKey = configuration["JwtSecretKey"] ?? throw new InvalidOperationException("Failed to get JWT Secret Key from configuration");
        string tokenIssuer = configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Failed to get Token Issuer from configuration");
        string tokenAudience = configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Failed to get Token Audience from configuration");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = requireHttpsMetadata;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                    ValidIssuer = tokenIssuer,
                    ValidAudience = tokenAudience,
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents()
                {
                    OnMessageReceived = ctx =>
                    {
                        ctx.Request.Cookies.TryGetValue(nameof(CookieType.accessToken), out string? accessToken);
                        if (!string.IsNullOrEmpty(accessToken))
                        {
                            ctx.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

        return services; 
    }
}
