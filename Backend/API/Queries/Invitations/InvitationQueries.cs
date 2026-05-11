using API.DTOs.Invitation.Responses;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Queries.Invitations; 

public class InvitationQueries(PlannerContext database)
{
    public async Task<List<InvitationInfoResponse>> GetInvitationsInfoByUserId(int userId)
    {
        var query = await database.Invitations.AsNoTracking()
            .Where(i => i.InvitedUserId == userId)
            .Select(i => new InvitationInfoResponse
            {
                Id = i.Id, 
                BoardName = i.Board.Name, 
                InvitedByUserEmail = i.InvitedByUser.Name, 
                Role = i.Role,
                Status = i.Status,
                ExpiresAt = i.ExpiresAt,
            }).ToListAsync();

        return query;       
    }
}
