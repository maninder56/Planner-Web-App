using API.DTOs.Profile.Responses;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Queries; 

public class ProfileQueries (PlannerContext database)
{
    public async Task<ProfileInfoResponse?> GetUserProfileInfoAsync(int userId)
    {
        var query = await database.Users.AsNoTracking()
            .Where(u => u.UserId == userId)
            .Select(u => new ProfileInfoResponse
            { 
                Email = u.Email, 
                Name = u.Name 
            }).SingleOrDefaultAsync();

        return query; 
    }
}
