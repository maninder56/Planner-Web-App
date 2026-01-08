using API.Models.Account;
using API.Models.Result;

namespace API.Repositories.Account; 

public interface IAccountRepository
{
    // Read Operations 

    // Create Operations
    public Task<Result<User, Error>> CreateUserAsync(string username, string email); 

    // Update Operations 


    // Delete Operations
}
