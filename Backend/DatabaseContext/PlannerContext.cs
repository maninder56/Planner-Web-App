using DatabaseContext.Types;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
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
    public DbSet<BoardMember> BoardMembers { get; set; }
    public DbSet<BoardStar> BoardStars { get; set; }
    public DbSet<Board> Boards { get; set; }
    public DbSet<BoardList> BoardLists { get; set; }
    public DbSet<Card> Cards { get; set; }
    public DbSet<Colour> Colours { get; set; }
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
    public DbSet<Invitation> Invitations { get; set; }


    public PlannerContext() { }

    public PlannerContext(DbContextOptions<PlannerContext> options) : base(options) { }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(u => u.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");

        modelBuilder.Entity<User>()
            .Property(u => u.Guest)
            .HasDefaultValue(false); 

        modelBuilder.Entity<User>()
            .HasOne(u => u.LastBoard)
            .WithMany()
            .HasForeignKey(u => u.LastBoardId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<RefreshToken>()
            .Property(r => r.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");

        modelBuilder.Entity<BoardStar>()
            .Property(bs => bs.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");

        modelBuilder.Entity<Board>()
            .Property(b => b.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");

        modelBuilder.Entity<Card>()
            .Property(c => c.DueDate)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");

        modelBuilder.Entity<Card>()
            .Property(c => c.Priority)
            .HasDefaultValue(Priority.Low);

        modelBuilder.Entity<PasswordResetToken>()
            .Property(p => p.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");

        modelBuilder.Entity<Invitation>()
            .Property(i => i.CreatedAt)
            .HasDefaultValueSql("(CURRENT_TIMESTAMP)");

        modelBuilder.Entity<Invitation>()
            .Property(i => i.Status)
            .HasConversion<string>();

        // user sending invites
        modelBuilder.Entity<Invitation>()
            .HasOne(i => i.InvitedByUser)
            .WithMany(u => u.InvitationsSent)
            .HasForeignKey(i => i.InvitedByUserId); 

        // user recieving invites
        modelBuilder.Entity<Invitation>()
            .HasOne(i => i.InvitedUser)
            .WithMany(u => u.InvitationsRecieved)
            .HasForeignKey(i => i.InvitedUserId); 

    }
}
