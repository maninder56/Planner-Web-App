using DatabaseContext;
using DatabaseContext.Types;

namespace API.Repositories.InvitationRepository; 

public interface IInvitationRepository
{
    // Read operations
    public Task<Invitation?> GetLatestInvitationByBoardAsync(int userId, int boardId);
    public Task<Invitation?> GetLatestPendingInvitationAsync(int userId, int boardId);
    public Task<Invitation?> GetPendingInvitationByIdAsync(int invitationId); 

    // Update operations
    public Task InvalidatePreviousPendingInvitationsAsync(int invitedUserId, int boardId);
    public Task<Invitation> UpdateInvitationStatusByIdAsync(int id, InvitationStatus status); 

    // Create operations 
    public Task<Invitation> CreateNewInvitation(Invitation newInvitation); 

    // Delete operations 
    public Task DeleteInvitationAsync(int invitationId);
    public Task DeleteAllPendingInvitationsAsync(int userId, int boardId); 
}
