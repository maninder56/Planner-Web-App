namespace API.ServiceRegistrationExtensions; 

public static class CorsServiceRegistration
{
    public static IServiceCollection AddCorsPolicy(this IServiceCollection service, IConfiguration configuration)
    {
        IConfigurationSection corsPolicy = configuration.GetSection("CorsPolicy");

        string policyName = corsPolicy["PolicyName"] ??
            throw new InvalidOperationException("Failed to get CORS policy name");

        string[] allowedOrigins = corsPolicy.GetSection("AllowedOrigins").Get<string[]>() ??
            throw new InvalidOperationException("Failed to get CORS Allowed Origins");

        service.AddCors(options =>
        {
            options.AddPolicy(name: policyName, policy =>
            {
                policy.WithOrigins(allowedOrigins)
                    .AllowCredentials()
                    .AllowAnyHeader()
                    .AllowAnyMethod(); 
            }); 
        }); 

        return service; 
    }
}
