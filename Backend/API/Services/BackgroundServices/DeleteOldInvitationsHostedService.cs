
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Services.BackgroundServices;

public class DeleteOldInvitationsHostedService : BackgroundService
{
    private readonly IServiceProvider serviceProvider; 
    private readonly ILogger<DeleteOldInvitationsHostedService> logger;

    public DeleteOldInvitationsHostedService(IServiceProvider serviceProvider, ILogger<DeleteOldInvitationsHostedService> logger)
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

                await database.Invitations
                    .Where(i => i.ExpiresAt < DateTime.Now.AddDays(-7))
                    .ExecuteDeleteAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to delete expired invitations.");
            }

            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }
}
