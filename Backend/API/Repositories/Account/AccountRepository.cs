using API.Models.Account;
using API.Models.Result;
using API.Utilities;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using MySqlConnector;
using System.Runtime.InteropServices;

namespace API.Repositories.Account;

public class AccountRepository : IAccountRepository
{
    private ILogger<AccountRepository> logger; 
    private PlannerContext database; 

    public AccountRepository(ILogger<AccountRepository> logger, PlannerContext context)
    {
        this.logger = logger;
        this.database = context;
    }

    // Read Operations

    public async Task<Result<User, Error>> GetUserDetailsByEmail(string email)
    {
        try
        {
            User? user = await database.Users
                .FirstOrDefaultAsync(u => u.Email == email); 

            if (user == null)
            {
                logger.LogWarning("Unable to find user with email: {Email}", email);
                return Result<User, Error>.Failed(Error.NotFound); 
            }
            else
            {
                return Result<User, Error>.Success(user);
            }
        }
        catch (Exception ex)
        {
            logger.LogError("Failed to get user details, Exception message: {ExceptionMessage}", ex.Message);
            return Result<User, Error>.Failed(Error.InternalServerError); 
        }
    }


    // Create Operations

    public async Task<Result<CreatedUser, Error>> CreateNewUserAsync(string username, string email, string passwordHash)
    {
        try
        {
            User newUser = new User
            {
                Name = username,
                Email = email,
                PasswordHash = passwordHash,
                Guest = false,
                LastBoardId = null
            }; 
        
            database.Users.Add(newUser);
            await database.SaveChangesAsync(); 

            return Result<CreatedUser, Error>.Success(new CreatedUser { UserId = newUser.UserId, Email = email, Name = username });
        }
        catch(DbUpdateException ex)
        {
            var sqlEx = ex.GetBaseException() as MySqlException;

            if (sqlEx is not null && sqlEx.Number == 1062) // Check if email was duplicate
            {
                logger.LogError("Failed to Create new user account with email {Email} which already exists.", email);
                return Result<CreatedUser, Error>.Failed(Error.BadRequest);
            }

            logger.LogError("Failed to Create New User account with email {Email}", email);
            return Result<CreatedUser, Error>.Failed(Error.InternalServerError);
        }
        catch (Exception ex)
        {
            logger.LogError("Failed to Create New User account with email {Email} and Exception message: {ExMessage}", email, ex.Message);
            return Result<CreatedUser, Error>.Failed(Error.InternalServerError); 
        }
    }


    public async Task<Result<Error>> CreateNewRefreshTokenHashByUserIdAsync(int userId, byte[] tokenBytes, DateTime expiresAt)
    {
        try
        {
            var user = await database.Users
                .Include(u => u.RefreshToken)
                .FirstOrDefaultAsync(u => u.UserId == userId); 

            if (user is null)
            {
                logger.LogWarning("Failed to Save new refresh token, User id: {UserId} Invalid", userId);
                return Result<Error>.Failed(Error.InternalServerError); 
            }

            var hashBytes = RefreshTokenUtility.HashRefreshToken(tokenBytes); 
            var tokenHash = RefreshTokenUtility.Encode(hashBytes);

            user.RefreshToken = new RefreshToken() { TokenHash = tokenHash, ExpiresAt = expiresAt };

            await database.SaveChangesAsync(); 
            return Result<Error>.Success();
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to save new refresh token, with Exception message: {ExceptionMessage}", ex.Message);
            return Result<Error>.Failed(Error.InternalServerError);
        }
    }


    // Delete operations

    public async Task<Result<Error>> DeleteRefreshTokenHashAsync(string refreshTokenInBase64)
    {
        try
        {
            var tokenBytes = RefreshTokenUtility.Decode(refreshTokenInBase64);
            var hashBytes = RefreshTokenUtility.HashRefreshToken(tokenBytes); 
            var hashInBase64 = RefreshTokenUtility.Encode(hashBytes);

            var token = await database.RefreshTokens
                .FirstOrDefaultAsync(r => r.TokenHash == hashInBase64); 

            if (token == null)
            {
                return Result<Error>.Success(); 
            }

            database.RefreshTokens.Remove(token);

            await database.SaveChangesAsync(); 
            return Result<Error>.Success();
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to delete refresh token, with Exception message: {ExceptionMessage}", ex.Message);
            return Result<Error>.Failed(Error.InternalServerError); 
        }
    }
}
