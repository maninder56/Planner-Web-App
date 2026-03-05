using API.Models.Account;
using API.Models.Result;
using API.Utilities;
using DatabaseContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using MySqlConnector;
using System.Reflection.Metadata.Ecma335;
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
        await database.Users.AsNoTracking()
        .FirstOrDefaultAsync(u => u.UserId == id); 


    public async Task<(User, RefreshToken)?> GetUserAndRefreshToken(string refreshTokenInBase64)
    {
        var tokenBytes = RefreshTokenUtility.Decode(refreshTokenInBase64);
        var hashBytes = RefreshTokenUtility.HashRefreshToken(tokenBytes);
        var hashInBase64 = RefreshTokenUtility.Encode(hashBytes);

        var token = await database.RefreshTokens.AsNoTracking()
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.TokenHash == hashInBase64);

        return token is null ? null : (token.User, token); 
    }

    public async Task<RefreshToken?> GetRefreshToken(string refreshTokenInBase64)
    {
        var tokenBytes = RefreshTokenUtility.Decode(refreshTokenInBase64);
        var hashBytes = RefreshTokenUtility.HashRefreshToken(tokenBytes);
        var hashInBase64 = RefreshTokenUtility.Encode(hashBytes);

        return await database.RefreshTokens.AsNoTracking()
            .FirstOrDefaultAsync(r => r.TokenHash == hashInBase64);
    }


    // Create Operations

    public async Task<User?> CreateNewUserAsync(string username, string email, string passwordHash)
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
        
        //catch(DbUpdateException ex)
        //{
        //    var sqlEx = ex.GetBaseException() as MySqlException;

        //    if (sqlEx is not null && sqlEx.Number == 1062) // Check if email was duplicate
        //    {
        //        logger.LogError("Failed to Create new user account with email {Email} which already exists.", email);
        //        return Result<CreatedUser>.Failed(ErrorType.BadRequest, new ProblemDetails()
        //        {
        //            Title = "Invalid Email", Detail = "An account exists for provided email; please use different email"
        //        });
        //    }

        //    logger.LogError("Failed to Create New User account with email {Email}", email);
        //    return Result<CreatedUser>.Failed(ErrorType.InternalServerError, new ProblemDetails());
        //}
        //catch (Exception ex)
        //{
        //    logger.LogError("Failed to Create New User account with email {Email} and Exception message: {ExMessage}", email, ex.Message);
        //    return Result<CreatedUser>.Failed(ErrorType.InternalServerError, new ProblemDetails()); 
        //}
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
    
    public async Task UpdateRefreshTokenHashAsync(RefreshToken refreshToken, byte[] tokenBytes)
    {
        var hashBytes = RefreshTokenUtility.HashRefreshToken(tokenBytes);
        var tokenHash = RefreshTokenUtility.Encode(hashBytes);

        refreshToken.TokenHash = tokenHash;
        database.RefreshTokens.Update(refreshToken);
           
        await database.SaveChangesAsync();       
    }


    // Delete operations

    public async Task DeleteRefreshTokenHashAsync(RefreshToken refreshToken)
    {
        database.RefreshTokens.Remove(refreshToken);
        await database.SaveChangesAsync(); 
    }

}
