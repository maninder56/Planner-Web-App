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
    public Task<(User, RefreshToken)?> GetUserAndRefreshToken(string base64TokenHash);
    public Task<(User, PasswordResetToken?)?> GetUserAndPasswordResetToken(string email); 

    // Create Operations
    public Task<User?> CreateNewUserAsync(string username, string email, string passwordHash);
    public Task<User?> CreateNewGuestUserAsync(string username, string email, string passwordHash); 
    public Task CreateNewRefreshTokenAsync(int userId, string base64TokenHash, DateTime expiresAt);
    public Task CreateNewPasswordResetTokenAsync(int userId, string base64TokenHash, DateTime expiresAt); 

    // Update Operations 
    public Task UpdateRefreshTokenAsync(int refreshTokenId, string newBase64TokenHash); 
    public Task UpdateUserPassword(int userId, string newPasswordHash);
    public Task UpdatePasswordResetToken(int userId, DateTime usedAt); 

    // Delete Operations
    public Task DeleteRefreshTokenAsync(string base64TokenHash); 
    public Task DeleteRefreshTokenAsync(int UserId);
    public Task DeleteAllPasswordResetTokensAsync(int userId); 
}
