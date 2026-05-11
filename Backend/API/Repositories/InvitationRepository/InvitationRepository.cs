using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.InvitationRepository;

public class InvitationRepository(PlannerContext database) : IInvitationRepository
{
    // Read Operations
    public async Task<Invitation?> GetInvitationByBoardAsync(string userEmail, int boardId)
    {
        return await database.Invitations.AsNoTracking()
            .FirstOrDefaultAsync(i => i.BoardId == boardId && i.InvitedUserEmail == userEmail);
    }


    // Create Operations
    public async Task<Invitation> CreateNewInvitation(Invitation newInvitation)
    {
        database.Invitations.Add(newInvitation);
        await database.SaveChangesAsync();
        return newInvitation;
    }



    // Delete Operations
    public async Task DeleteInvitationAsync(int invitationId)
    {
        await database.Invitations
            .Where(i => i.Id == invitationId)
            .ExecuteDeleteAsync(); 
    }
}
