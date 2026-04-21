using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

// This class is only userd when creating migrations 
public class PlannerDatabaseContextFactory : IDesignTimeDbContextFactory<PlannerContext>
{
    public PlannerContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .AddUserSecrets<PlannerContext>()
            .Build();

        // Only used for creating migrations
        string connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Unable to load database connection"); 

        var optionsBuilder = new DbContextOptionsBuilder<PlannerContext>(); 

        optionsBuilder.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 44))); 

        optionsBuilder.EnableSensitiveDataLogging();

        return new PlannerContext(optionsBuilder.Options);  
    }
}
