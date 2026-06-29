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


    public async Task<(User, RefreshToken)?> GetUserAndRefreshToken(string base64TokenHash)
    {
        var token = await database.RefreshTokens.AsNoTracking()
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.TokenHash == base64TokenHash);

        return token is null ? null : (token.User, token); 
    }

    public async Task<(User, PasswordResetToken?)?> GetUserAndPasswordResetToken(string email)
    {
        var user = await database.Users.AsNoTracking()
            .Include(u => u.PasswordResetToken)
            .FirstOrDefaultAsync (u => u.Email == email);

        return user is null ? null : (user, user.PasswordResetToken); 
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


    public async Task<User?> CreateNewGuestUserAsync(string username, string email, string passwordHash)
    {
        User newUser = new User
        {
            Name = username,
            Email = email,
            PasswordHash = passwordHash,
            Guest = true,
            LastBoardId = null
        };

        database.Users.Add(newUser);
        await database.SaveChangesAsync();

        return newUser;
    }


    public async Task CreateNewRefreshTokenAsync(int userId, string base64TokenHash, DateTime expiresAt)
    {
        User user = await database.Users
            .Include(u => u.RefreshToken)
            .FirstOrDefaultAsync(u => u.UserId == userId)
            ?? throw new NotFoundException("User not found"); 

        user.RefreshToken = new RefreshToken() { TokenHash = base64TokenHash, ExpiresAt = expiresAt}; 

        await database.SaveChangesAsync();
    }


    public async Task CreateNewPasswordResetTokenAsync(int userId, string base64TokenHash, DateTime expiresAt)
    {
        User user = await database.Users
            .Include(u => u.PasswordResetToken)
            .FirstOrDefaultAsync(u => u.UserId == userId)
            ?? throw new NotFoundException("User not found");

        user.PasswordResetToken = new PasswordResetToken()
        {
            TokenHash = base64TokenHash,
            ExpiresAt = expiresAt,
        };

        await database.SaveChangesAsync();
    }


    // Update operations 
    
    public async Task UpdateRefreshTokenAsync(int refreshTokenId, string newBase64TokenHash)
    {
        RefreshToken refreshToken = await database.RefreshTokens
            .FirstOrDefaultAsync(r => r.RefreshTokenId == refreshTokenId)
            ?? throw new NotFoundException("Refresh token not found");

        refreshToken.TokenHash = newBase64TokenHash; 

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

    public async Task UpdatePasswordResetToken(int userId, DateTime usedAt)
    {
        PasswordResetToken token = await database.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.UserId == userId)
            ?? throw new NotFoundException("Password reset token not found"); 

        token.UsedAt = usedAt;

        await database.SaveChangesAsync();
    }


    // Delete operations

    public async Task DeleteRefreshTokenAsync(string base64TokenHash)
    {
        await database.RefreshTokens
            .Where(r => r.TokenHash == base64TokenHash)
            .ExecuteDeleteAsync();
    }

    public async Task DeleteRefreshTokenAsync(int UserId)
    {
        await database.RefreshTokens
            .Where(r => r.UserId == UserId)
            .ExecuteDeleteAsync();
    }


    public async Task DeleteAllPasswordResetTokensAsync(int userId)
    {
        await database.PasswordResetTokens
            .Where(p => p.UserId == userId)
            .ExecuteDeleteAsync();
    }


}
