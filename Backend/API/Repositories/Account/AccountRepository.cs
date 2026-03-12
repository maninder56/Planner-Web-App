using API.Exceptions;
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
        
    }


    public async Task CreateNewRefreshTokenHashByUserIdAsync(int userId, byte[] tokenBytes, DateTime expiresAt)
    {
        var hashBytes = RefreshTokenUtility.HashRefreshToken(tokenBytes); 
        var tokenHash = RefreshTokenUtility.Encode(hashBytes);

        User user = await database.Users
            .Include(u => u.RefreshToken)
            .FirstAsync(u => u.UserId == userId);

        user.RefreshToken = new RefreshToken() { TokenHash = tokenHash, ExpiresAt = expiresAt}; 

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


    public async Task UpdateUserPassword(int userId, string newPasswordHash)
    {
        User user = await database.Users
            .SingleOrDefaultAsync(u => u.UserId == userId)
            ?? throw new NotFoundException("User not found");

        user.PasswordHash = newPasswordHash; 

        await database.SaveChangesAsync();  
    }


    // Delete operations

    public async Task DeleteRefreshTokenHashAsync(RefreshToken refreshToken)
    {
        database.RefreshTokens.Remove(refreshToken);
        await database.SaveChangesAsync(); 
    }

    public async Task DeleteRefreshTokenAsync(int UserId)
    {
        await database.RefreshTokens
            .Where(r => r.UserId == UserId)
            .ExecuteDeleteAsync();
    }

}
