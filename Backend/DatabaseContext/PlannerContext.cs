using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext; 

public class PlannerContext : DbContext
{

    public PlannerContext(DbContextOptions<PlannerContext> options) 
        : base(options) { }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(u => u.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");

        modelBuilder.Entity<User>()
            .Property(u => u.Guest)
            .HasDefaultValue(false); 

        modelBuilder.Entity<RefreshToken>()
            .Property(r => r.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
    }
}
