using API.Exceptions;
using DatabaseContext;

namespace API.Repositories.Profile; 

public class ProfileRepository(PlannerContext database) : IProfileRepository
{
    public async Task UpdateUserNameAsync(int userId, string newName)
    {
        User user = database.Users
            .SingleOrDefault(u => u.UserId == userId)
            ?? throw new NotFoundException("User not found");
            
        user.Name = newName;

        await database.SaveChangesAsync();
    }
}
