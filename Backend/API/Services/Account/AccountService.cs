using API.DTOs.Account;
using API.Models.Account;
using API.Models.Result;
using API.Repositories.Account;
using API.Utilities;
using DatabaseContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Account; 

public class AccountService : IAccountService
{
    private ILogger<AccountService> logger;
    private IAccountRepository repository; 
    private TokenProviderUtility tokenProviderUtility;
    private IConfiguration configuration;
    private CookiesUtility cookiesUtility;

    private int refreshTokenLifeInDays;
    
    public AccountService(
        ILogger<AccountService> logger, IAccountRepository repository, 
        IConfiguration configuration, TokenProviderUtility tokenProviderUtility,
        CookiesUtility cookiesUtility)
    {
        this.logger = logger;
        this.repository = repository;
        this.tokenProviderUtility = tokenProviderUtility;
        this.configuration = configuration;
        this.cookiesUtility = cookiesUtility;
        
        refreshTokenLifeInDays = configuration.GetValue<int>("RefreshToken:ExpirationInDays", cookiesUtility.GetRefreshTokenLifeInDaysDefaultValue());
    }




    // Read Operations


    public async Task<Result<Tokens>> LogInUserAsync(LogInUserDTO logInUser)
    {
       
        // get user details by email
        var user = await repository.GetUserByEmail(logInUser.Email);

        if (user is null)
        {
            logger.LogWarning("Unable to find user with email: {Email}", logInUser.Email);
            return Result<Tokens>.Failed(ErrorType.BadRequest, "Invalid User Credentials"); 
        }

        // verify password 
        if (!PasswordUtility.VerifyPassword(user.PasswordHash, logInUser.Password))
        {
            logger.LogWarning("Login failed for user with email: {Email}; Invalid password", logInUser.Email);
            return Result<Tokens>.Failed(ErrorType.BadRequest, "Invalid User Credentials");

        }

        // create tokens 
        byte[] refreshTokenBytes = RefreshTokenUtility.GenerateRefreshTokenAsByteArray();

        Tokens tokens = new Tokens
        {
            AccessToken = tokenProviderUtility.Create(user.UserId, user.Email),
            RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes)
        };


        await repository.CreateNewRefreshTokenHashByUserIdAsync(user.UserId,
        refreshTokenBytes, DateTime.UtcNow.AddDays(refreshTokenLifeInDays));

        // return tokens for cookies
        return Result<Tokens>.Success(tokens);

    }





    // Create Operations


    public async Task<Result<Tokens>> CreateNewUserAsync(NewUserDTO newUser)
    {
       
        string passwordHash = PasswordUtility.HashPassword(newUser.Password);

        var userSaved = await repository.CreateNewUserAsync(newUser.Name, newUser.Email, passwordHash);

        if (userSaved is null)
        {
            logger.LogWarning("Failed to save new user user: {Email}", newUser.Email);
            return Result<Tokens>.Failed(ErrorType.InternalServerError, "Server Error"); 
        }

        byte[] refreshTokenBytes = RefreshTokenUtility.GenerateRefreshTokenAsByteArray();

        Tokens tokens = new Tokens
        {
            AccessToken = tokenProviderUtility.Create(userSaved.UserId, userSaved.Email),
            RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes)
        };

        await repository.CreateNewRefreshTokenHashByUserIdAsync(userSaved.UserId,
            refreshTokenBytes, DateTime.UtcNow.AddDays(refreshTokenLifeInDays));

        return Result<Tokens, ErrorType>.Success(tokens);
        
    }




    // Update operations

    public async Task<Result<Tokens>> UpdateRefreshTokenAsync(string refreshTokenInBase64)
    {
        // get user details by refreshtoken 
        var userAndRefreshTokenResult = await repository.GetUserAndRefreshToken(refreshTokenInBase64);

        if (userAndRefreshTokenResult is null)
        {
            logger.LogWarning("Unable to find refresh token (base64): {RefreshToken}", refreshTokenInBase64);
            return Result<Tokens>.Failed(ErrorType.BadRequest, "Invalid Refresh token"); 
        }

        (User user, RefreshToken refreshToken) = userAndRefreshTokenResult.Value; 

        // check if refreshtoken is expired
        if (refreshToken.ExpiresAt < DateTime.UtcNow)
        {
            logger.LogWarning("Refresh token expired for user with email: {Email}", user.Email);
            return Result<Tokens>.Failed(ErrorType.Unauthorized, "Invalid Refresh token", "Refresh token expired");
        }

        // Verify refresh tokens 
        if (!RefreshTokenUtility.VerifyBase64RefreshTokenHash(refreshToken.TokenHash, refreshTokenInBase64))
        {
            logger.LogWarning("Invalid refresh token of user with email: {Email}", user.Email);
            return Result<Tokens>.Failed(ErrorType.Unauthorized, "Invalid Refresh token");
        }

        // create new refresh token and jwt 
        byte[] refreshTokenBytes = RefreshTokenUtility.GenerateRefreshTokenAsByteArray();

        Tokens tokens = new Tokens
        {
            AccessToken = tokenProviderUtility.Create(user.UserId, user.Email),
            RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes),
            RefreshTokenExpiresAt = refreshToken.ExpiresAt
        }; 

        await repository.UpdateRefreshTokenHashAsync(refreshToken,refreshTokenBytes);

        // return tokens 
        return Result<Tokens>.Success(tokens);
    }




    // Delete operations


    public async Task<Result> LogoutUserAsync(string refreshTokenInBase64)
    {
        RefreshToken? refreshToken = await repository.GetRefreshToken(refreshTokenInBase64);

        if (refreshToken is not null)
        {
            await repository.DeleteRefreshTokenHashAsync(refreshToken);
        }

        return Result.Success(); 
    }


}
