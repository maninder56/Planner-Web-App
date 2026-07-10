using API.Exceptions;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;
using DatabaseContext.Types; 

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


    public async Task DeleteProfileAsync(int userId)
    {
        await using var transaction = await database.Database.BeginTransactionAsync();

        await database.Boards
            .Where(b => b.BoardMembers
                .Any(bm => bm.UserId == userId && bm.Role == Role.Owner))
            .ExecuteDeleteAsync(); 

        await database.Users.Where(u => u.UserId == userId)
            .ExecuteDeleteAsync(); 

        await transaction.CommitAsync();
    }
}
