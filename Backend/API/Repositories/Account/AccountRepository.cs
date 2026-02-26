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

    public async Task<Result<User, Error>> GetUserDetailsByEmail(string email)
    {
        try
        {
            User? user = await database.Users
                .FirstOrDefaultAsync(u => u.Email == email); 

            if (user == null)
            {
                logger.LogWarning("Unable to find user with email: {Email}", email);
                return Result<User, Error>.Failed(Error.NotFound, new ProblemDetails()
                {
                    Title = "Invalid Email", Detail = "User does not exists", 
                }); 
            }
            else
            {
                return Result<User, Error>.Success(user);
            }
        }
        catch (Exception ex)
        {
            logger.LogError("Failed to get user details, Exception message: {ExceptionMessage}", ex.Message);
            return Result<User, Error>.Failed(Error.InternalServerError, new ProblemDetails()); 
        }
    }


    public async Task<Result<(User, RefreshToken), Error>> GetUserAndRefreshToken(string refreshTokenInBase64)
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
                return Result<(User, RefreshToken), Error>.Failed(Error.NotFound, new ProblemDetails()
                {
                    Title = "Invalid Refresh token", 
                }); 
            }
            else
            {
                return Result<(User, RefreshToken), Error>.Success((token.User, token)); 
            }

        }
        catch (Exception ex)
        {
            logger.LogError("Failed to get user and refresh token, Exception message: {ExceptionMessage}", ex.Message); 
            return Result<(User, RefreshToken), Error>.Failed(Error.InternalServerError, new ProblemDetails()); 
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
                return Result<CreatedUser, Error>.Failed(Error.BadRequest, new ProblemDetails()
                {
                    Title = "Invalid Email", Detail = "An account exists for provided email; please use different email"
                });
            }

            logger.LogError("Failed to Create New User account with email {Email}", email);
            return Result<CreatedUser, Error>.Failed(Error.InternalServerError, new ProblemDetails());
        }
        catch (Exception ex)
        {
            logger.LogError("Failed to Create New User account with email {Email} and Exception message: {ExMessage}", email, ex.Message);
            return Result<CreatedUser, Error>.Failed(Error.InternalServerError, new ProblemDetails()); 
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
                return Result<Error>.Failed(Error.BadRequest, new ProblemDetails()
                {
                    Title = "Invalid User", Detail = "User does not exists", 
                }); 
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
            return Result<Error>.Failed(Error.InternalServerError, new ProblemDetails());
        }
    }


    // Update operations 
    
    public async Task<Result<Error>> UpdateRefreshTokenHashByUserIdAsync(int userId, byte[] tokenBytes)
    {
        try
        {
            var user = await database.Users
                .Include(u => u.RefreshToken)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user is null)
            {
                logger.LogWarning("Failed to update refresh token, User id: {UserId} Invalid", userId);
                return Result<Error>.Failed(Error.InternalServerError, new ProblemDetails()
                {
                    Title = "Invalid User", Detail = "User does not exists", 
                });
            }

            var hashBytes = RefreshTokenUtility.HashRefreshToken(tokenBytes);
            var tokenHash = RefreshTokenUtility.Encode(hashBytes);

            user.RefreshToken.TokenHash = tokenHash;    

            await database.SaveChangesAsync();
            return Result<Error>.Success();
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to save new refresh token, with Exception message: {ExceptionMessage}", ex.Message);
            return Result<Error>.Failed(Error.InternalServerError, new ProblemDetails());
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
            return Result<Error>.Failed(Error.InternalServerError, new ProblemDetails()); 
        }
    }

}
