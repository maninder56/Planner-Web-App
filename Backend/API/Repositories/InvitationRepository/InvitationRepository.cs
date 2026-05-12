using DatabaseContext;
using Microsoft.EntityFrameworkCore;
using DatabaseContext.Types; 

namespace API.Repositories.InvitationRepository;

public class InvitationRepository(PlannerContext database) : IInvitationRepository
{
    // Read Operations
    public async Task<Invitation?> GetLatestInvitationByBoardAsync(int userId, int boardId)
    {
        return await database.Invitations.AsNoTracking()
            .OrderByDescending(i => i.CreatedAt)
            .FirstOrDefaultAsync(i => i.BoardId == boardId && i.InvitedUserId == userId);
    }

    public async Task<Invitation?> GetLatestPendingInvitationAsync(int userId, int boardId)
    {
        return await database.Invitations.AsNoTracking()
            .OrderByDescending(i => i.CreatedAt)
            .FirstOrDefaultAsync(
                i => i.BoardId == boardId && 
                i.InvitedUserId == userId && 
                i.Status == InvitationStatus.Pending);
    }



    public async Task<bool> DoesUserHasAnyPendingInvitation(int userId, int boardId)
    {
        return await database.Invitations.AsNoTracking()
            .AnyAsync(i => i.InvitedUserId == userId && 
                i.BoardId == boardId && i.Status == InvitationStatus.Pending);
    }

    // Create Operations
    public async Task<Invitation> CreateNewInvitation(Invitation newInvitation)
    {
        database.Invitations.Add(newInvitation);
        await database.SaveChangesAsync();
        return newInvitation;
    }


    // update operations
    public async Task InvalidatePreviousPendingInvitationsAsync(int userId, int boardId)
    {
        await database.Invitations
            .Where(i => i.InvitedUserId == userId && i.BoardId == boardId && i.Status == InvitationStatus.Pending)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(i => i.Status, InvitationStatus.Revoked));
    }



    // Delete Operations
    public async Task DeleteInvitationAsync(int invitationId)
    {
        await database.Invitations
            .Where(i => i.Id == invitationId)
            .ExecuteDeleteAsync(); 
    }

    public async Task DeleteAllPendingInvitationsAsync(int userId, int boardId)
    {
        await database.Invitations
            .Where(i => i.InvitedUserId == userId && i.BoardId == boardId && i.Status == InvitationStatus.Pending)
            .ExecuteDeleteAsync();
    }
}
