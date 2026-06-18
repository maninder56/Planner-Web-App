using API.DTOs.Profile.Responses;
using API.DTOs.User.Responses;
using API.Models.Account;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Queries.Profile; 

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

    public async Task<List<UserInfo>> GetUsersInfoAsync(int[] userIDs)
    {
        var query = await database.Users.AsNoTracking()
            .Where(u => userIDs.Contains(u.UserId))
            .Select(u => new UserInfo
            {
                UserId = u.UserId,
                Name = u.Name,
                Email = u.Email,
            }).ToListAsync(); 

        return query;

    }
}
