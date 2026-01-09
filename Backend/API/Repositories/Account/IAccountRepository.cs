using API.DTOs.Account;
using API.Models.Account;
using API.Models.Result;

namespace API.Repositories.Account; 

public interface IAccountRepository
{
    // Read Operations 

    // Create Operations
    public Task<Result<CreatedUser, Error>> CreateUserAsync(string username, string email, string passwordHash); 

    // Update Operations 


    // Delete Operations
}
