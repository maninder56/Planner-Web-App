using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext; 

public class PlannerContext : DbContext
{
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<WorkspaceMember> WorkspaceMembers { get; set; }
    public DbSet<BoardStar> BoardStars { get; set; }
    public DbSet<Workspace> Workspaces { get; set; }
    public DbSet<Board> Boards { get; set; }
    public DbSet<BoardList> BoardLists { get; set; }
    public DbSet<Card> Cards { get; set; }  


    public PlannerContext() { }

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

        modelBuilder.Entity<BoardStar>()
            .Property(bs => bs.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");

        modelBuilder.Entity<Workspace>()
            .Property(w => w.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");

        modelBuilder.Entity<Board>()
            .Property(b => b.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");
    }
}
