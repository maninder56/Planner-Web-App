using API.DTOs.Account;
using API.Models.Account;
using API.Models.Result;
using DatabaseContext;

namespace API.Repositories.Account; 

public interface IAccountRepository
{
    // Read Operations 
    public Task<Result<User, Error>> GetUserDetailsByEmail(string email);

    // Create Operations
    public Task<Result<CreatedUser, Error>> CreateNewUserAsync(string username, string email, string passwordHash);
    public Task<Result<Error>> CreateNewRefreshTokenHashByUserIdAsync(int userId, byte[] tokenBytes, DateTime expiresAt); 

    // Update Operations 


    // Delete Operations
}
