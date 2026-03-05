using API.DTOs.Account;
using API.Models.Account;
using API.Models.Result;
using DatabaseContext;

namespace API.Repositories.Account; 

public interface IAccountRepository
{
    // Read Operations 
    public Task<Result<User, ErrorType>> GetUserDetailsByEmail(string email);
    public Task<Result<(User, RefreshToken), ErrorType>> GetUserAndRefreshToken(string refreshTokenInBase64);

    // Create Operations
    public Task<Result<CreatedUser, ErrorType>> CreateNewUserAsync(string username, string email, string passwordHash);
    public Task<Result<ErrorType>> CreateNewRefreshTokenHashByUserIdAsync(int userId, byte[] tokenBytes, DateTime expiresAt);

    // Update Operations 
    public Task<Result<ErrorType>> UpdateRefreshTokenHashByUserIdAsync(int userId, byte[] tokenBytes); 

    // Delete Operations
    public Task<Result<ErrorType>> DeleteRefreshTokenHashAsync(string refreshTokenInBase64);
}
