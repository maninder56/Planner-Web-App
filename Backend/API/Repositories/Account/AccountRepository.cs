using API.Models.Account;
using API.Models.Result;
using API.Utilities;
using DatabaseContext;
using Microsoft.AspNetCore.Mvc;
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

    public async Task<User?> GetUserByEmail(string email)
    {
        return await database.Users.AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email); 
    }

    public async Task<User?> GetUserById(int id) =>
        await database.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == id); 


    public async Task<Result<(User, RefreshToken)>> GetUserAndRefreshToken(string refreshTokenInBase64)
    {
        try
        {
            var tokenBytes = RefreshTokenUtility.Decode(refreshTokenInBase64);
            var hashBytes = RefreshTokenUtility.HashRefreshToken(tokenBytes);
            var hashInBase64 = RefreshTokenUtility.Encode(hashBytes);

            var token = await database.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.TokenHash == hashInBase64); 

            if (token == null)
            {
                logger.LogWarning("Unable to find refresh token (base64): {RefreshToken}", refreshTokenInBase64);
                return Result<(User, RefreshToken)>.Failed(ErrorType.NotFound, new ProblemDetails()
                {
                    Title = "Invalid Refresh token", 
                }); 
            }
            else
            {
                return Result<(User, RefreshToken)>.Success((token.User, token)); 
            }

        }
        catch (Exception ex)
        {
            logger.LogError("Failed to get user and refresh token, Exception message: {ExceptionMessage}", ex.Message); 
            return Result<(User, RefreshToken)>.Failed(ErrorType.InternalServerError, new ProblemDetails()); 
        }
    }


    // Create Operations

    public async Task<User?> CreateNewUserAsync(string username, string email, string passwordHash)
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

            return newUser; 
        }
        catch(DbUpdateException ex)
        {
            var sqlEx = ex.GetBaseException() as MySqlException;

            if (sqlEx is not null && sqlEx.Number == 1062) // Check if email was duplicate
            {
                logger.LogError("Failed to Create new user account with email {Email} which already exists.", email);
                return Result<CreatedUser>.Failed(ErrorType.BadRequest, new ProblemDetails()
                {
                    Title = "Invalid Email", Detail = "An account exists for provided email; please use different email"
                });
            }

            logger.LogError("Failed to Create New User account with email {Email}", email);
            return Result<CreatedUser>.Failed(ErrorType.InternalServerError, new ProblemDetails());
        }
        catch (Exception ex)
        {
            logger.LogError("Failed to Create New User account with email {Email} and Exception message: {ExMessage}", email, ex.Message);
            return Result<CreatedUser>.Failed(ErrorType.InternalServerError, new ProblemDetails()); 
        }
    }


    public async Task CreateNewRefreshTokenHashByUserIdAsync(int userId, byte[] tokenBytes, DateTime expiresAt)
    {

        var hashBytes = RefreshTokenUtility.HashRefreshToken(tokenBytes); 
        var tokenHash = RefreshTokenUtility.Encode(hashBytes);

        var refreshToken = new RefreshToken() { TokenHash = tokenHash, ExpiresAt = expiresAt, UserId = userId };

        database.RefreshTokens.Add(refreshToken);   

        await database.SaveChangesAsync();
    }


    // Update operations 
    
    public async Task<Result<ErrorType>> UpdateRefreshTokenHashByUserIdAsync(int userId, byte[] tokenBytes)
    {
        try
        {
            var user = await database.Users
                .Include(u => u.RefreshToken)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user is null)
            {
                logger.LogWarning("Failed to update refresh token, User id: {UserId} Invalid", userId);
                return Result<ErrorType>.Failed(ErrorType.InternalServerError, new ProblemDetails()
                {
                    Title = "Invalid User", Detail = "User does not exists", 
                });
            }

            var hashBytes = RefreshTokenUtility.HashRefreshToken(tokenBytes);
            var tokenHash = RefreshTokenUtility.Encode(hashBytes);

            user.RefreshToken.TokenHash = tokenHash;    

            await database.SaveChangesAsync();
            return Result<ErrorType>.Success();
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to save new refresh token, with Exception message: {ExceptionMessage}", ex.Message);
            return Result<ErrorType>.Failed(ErrorType.InternalServerError, new ProblemDetails());
        }
    }


    // Delete operations

    public async Task<Result<ErrorType>> DeleteRefreshTokenHashAsync(string refreshTokenInBase64)
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
                return Result<ErrorType>.Success(); 
            }

            database.RefreshTokens.Remove(token);

            await database.SaveChangesAsync(); 
            return Result<ErrorType>.Success();
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to delete refresh token, with Exception message: {ExceptionMessage}", ex.Message);
            return Result<ErrorType>.Failed(ErrorType.InternalServerError, new ProblemDetails()); 
        }
    }

}
