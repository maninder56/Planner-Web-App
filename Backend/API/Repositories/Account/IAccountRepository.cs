using API.DTOs.Account;
using API.Models.Account;
using API.Models.Result;
using DatabaseContext;

namespace API.Repositories.Account; 

public interface IAccountRepository
{
    // Read Operations 
    public Task<User?> GetUserByEmail(string email);
    public Task<User?> GetUserById(int id);
    public Task<(User, RefreshToken)?> GetUserAndRefreshToken(string refreshTokenInBase64);
    public Task<RefreshToken?> GetRefreshToken(string refreshTokenInBase64);

    // Create Operations
    public Task<User?> CreateNewUserAsync(string username, string email, string passwordHash);
    public Task CreateNewRefreshTokenHashByUserIdAsync(int userId, byte[] tokenBytes, DateTime expiresAt);

    // Update Operations 
    public Task UpdateRefreshTokenHashAsync(RefreshToken refreshToken, byte[] tokenBytes); 

    // Delete Operations
    public Task DeleteRefreshTokenHashAsync(RefreshToken refreshToken);
}
