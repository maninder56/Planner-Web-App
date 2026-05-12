using DatabaseContext;

namespace API.Repositories.InvitationRepository; 

public interface IInvitationRepository
{
    // Read operations
    public Task<Invitation?> GetLatestInvitationByBoardAsync(int userId, int boardId);
    public Task<Invitation?> GetLatestPendingInvitationAsync(int userId, int boardId);

    // Update operations
    public Task InvalidatePreviousPendingInvitationsAsync(int userId, int boardId); 

    // Create operations 
    public Task<Invitation> CreateNewInvitation(Invitation newInvitation); 

    // Delete operations 
    public Task DeleteInvitationAsync(int invitationId);
    public Task DeleteAllPendingInvitationsAsync(int userId, int boardId); 
}
