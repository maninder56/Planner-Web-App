using API.Queries.Boards;
using API.Repositories.Account;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.ServiceRegistrationExtensions; 

public static class DatabaseServiceRegistration
{
    public static IServiceCollection AddDatabaseService(this IServiceCollection services, IConfiguration configuration)
    {
        string connectionString = configuration.GetConnectionString("DefaultConnection")
                    ?? throw new InvalidOperationException("Unable to load database connection string");

        services.AddDbContext<PlannerContext>(options =>
            options.UseMySql(
                connectionString,
                new MySqlServerVersion(new Version(8, 0, 44)),
                b => b.MigrationsAssembly("DatabaseContext")));


        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<BoardQueries>(); 

        return services;
    }
}
