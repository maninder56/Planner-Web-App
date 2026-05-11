using DatabaseContext;

namespace API.Repositories.InvitationRepository; 

public interface IInvitationRepository
{
    // Read operations
    public Task<Invitation?> GetInvitationByBoardAsync(string userEmail, int boardId);


    // Create operations 
    public Task<Invitation> CreateNewInvitation(Invitation newInvitation); 

    // Delete operations 
    public Task DeleteInvitationAsync(int invitationId); 
}
