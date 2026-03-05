using API.DTOs.Account;
using API.Models.Account;
using API.Models.Result;
using API.Repositories.Account;
using API.Utilities;
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
        try
        {
            string passwordHash = PasswordUtility.HashPassword(newUser.Password);

            var userSaved = await repository.CreateNewUserAsync(newUser.Name, newUser.Email, passwordHash);

            if (userSaved is null)
            {
                logger.LogWarning("Failed to save user: {Email}", newUser.Email);
                throw new DbUpdateException("Failed to save user"); 
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

    }




    // Update operations

    public async Task<Result<Tokens, ErrorType>> UpdateRefreshTokenAsync(HttpContext httpContext)
    {
        // get refresh token from httpcontext 
        var refreshTokenInBase64 = cookiesUtility.GetRefreshTokenFromHttpContext(httpContext);

        if (refreshTokenInBase64 == null)
        {
            logger.LogWarning("Unable to find refresh token in cookies"); 
            return Result<Tokens,ErrorType>.Failed(ErrorType.BadRequest, new ProblemDetails()
            {
                Title = "Refresh token not found", Detail = "Unable to find refreh token form cookies"
            });
        }

        // get user details by refreshtoken 
        var userAndRefreshTokenResult = await repository.GetUserAndRefreshToken(refreshTokenInBase64);
        var (user, refreshToken) = userAndRefreshTokenResult.Data; 

        if (!userAndRefreshTokenResult.Successful || user == null || refreshToken == null)
        {
            return Result<Tokens, ErrorType>.Failed(userAndRefreshTokenResult.Error, userAndRefreshTokenResult.ProblemDetails);
        }

        // check if refreshtoken is expired
        if (refreshToken.ExpiresAt < DateTime.UtcNow)
        {
            logger.LogWarning("Refresh token expired for user with email: {Email}", user.Email); 
            return Result<Tokens, ErrorType>.Failed(ErrorType.Unauthorized, new ProblemDetails()
            {
                Title = "Invalid Refresh token", Detail = "Refresh token expired", 
            }); 
        }

        // Verify refresh tokens 
        if (!RefreshTokenUtility.VerifyBase64RefreshTokenHash(refreshToken.TokenHash, refreshTokenInBase64))
        {
            logger.LogWarning("Invalid refresh token of user with email: {Email}", user.Email); 
            return Result<Tokens, ErrorType>.Failed(ErrorType.Unauthorized, new ProblemDetails()
            {
                Title = "Invalid Refresh token",
            }); 
        }

        // create new refresh token and jwt 
        byte[] refreshTokenBytes = RefreshTokenUtility.GenerateRefreshTokenAsByteArray();

        Tokens tokens = new Tokens
        {
            AccessToken = tokenProviderUtility.Create(user.UserId, user.Email),
            RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes),
            RefreshTokenExpiresAt = refreshToken.ExpiresAt
        }; 

        await repository.UpdateRefreshTokenHashByUserIdAsync(user.UserId,refreshTokenBytes);

        // return tokens 
        return Result<Tokens, ErrorType>.Success(tokens);
    }




    // Delete operations


    public async Task<Result<ErrorType>> LogoutUserAsync(HttpContext httpContext)
    {
        string? refreshTokenInBase64 = cookiesUtility.GetRefreshTokenFromHttpContext(httpContext);

        if (refreshTokenInBase64 == null)
        {
            return Result<ErrorType>.Success(); 
        }

        await repository.DeleteRefreshTokenHashAsync(refreshTokenInBase64);

        return Result<ErrorType>.Success();
    }


}
