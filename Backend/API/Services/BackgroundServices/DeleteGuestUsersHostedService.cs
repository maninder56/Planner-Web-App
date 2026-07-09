
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Services.BackgroundServices;

public class DeleteGuestUsersHostedService : BackgroundService
{
    private readonly IServiceProvider serviceProvider; 
    private readonly ILogger<DeleteGuestUsersHostedService> logger;

    public DeleteGuestUsersHostedService(IServiceProvider serviceProvider, ILogger<DeleteGuestUsersHostedService> logger)
    {
        this.serviceProvider = serviceProvider;
        this.logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using IServiceScope scope = serviceProvider.CreateScope();

                var database = scope.ServiceProvider.GetRequiredService<PlannerContext>();

                await database.Users
                    .Where(u => u.Guest && u.CreatedAt < DateTime.Now.AddDays(-7))
                    .ExecuteDeleteAsync(stoppingToken);
            }
            catch(Exception ex)
            {
                logger.LogError(ex, "Failed to delete expired guest users."); 
            }

            await Task.Delay(TimeSpan.FromDays(1), stoppingToken); 
        }
    }
}
