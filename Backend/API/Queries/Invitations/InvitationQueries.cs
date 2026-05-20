using API.DTOs.Invitation.Responses;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;
using DatabaseContext.Types; 

namespace API.Queries.Invitations; 

public class InvitationQueries(PlannerContext database)
{
    public async Task<List<InvitationInfoResponse>> GetValidPendingInvitationsInfoByUserId(int userId)
    {
        var query = await database.Invitations.AsNoTracking()
            .Where(i => i.InvitedUserId == userId && 
                i.Status == InvitationStatus.Pending && 
                i.ExpiresAt > DateTime.Now)
            .OrderByDescending(i => i.CreatedAt)
            .Select(i => new InvitationInfoResponse
            {
                Id = i.Id, 
                BoardId = i.BoardId,
                BoardName = i.Board.Name, 
                InvitedByUserEmail = i.InvitedByUser.Email, 
                Role = i.Role,
                Status = i.Status,
                ExpiresAt = i.ExpiresAt,
            }).ToListAsync();

        return query;       
    }
}
