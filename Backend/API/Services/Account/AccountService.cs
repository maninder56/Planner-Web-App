using API.DTOs.Account;
using API.Models.Account;
using API.Models.Result;
using API.Repositories.Account;
using API.Utilities;

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


    public async Task<Result<Tokens, Error>> LogInUserAsync(LogInUserDTO logInUser)
    {
        // get user details by email
        var userResult = await repository.GetUserDetailsByEmail(logInUser.Email);

        if (!userResult.Successful || userResult.Data == null)
        {
            return Result<Tokens, Error>.Failed(userResult.Error); 
        }

        // verify password 
        if (!PasswordUtility.VerifyPassword(userResult.Data.PasswordHash, logInUser.Password))
        {
            logger.LogWarning("Login failed for user with email: {Email}; Invalid password", logInUser.Email);
            return Result<Tokens, Error>.Failed(Error.BadRequest);
        }

        // create tokens 
        byte[] refreshTokenBytes = RefreshTokenUtility.GenerateRefreshTokenAsByteArray();

        Tokens tokens = new Tokens
        {
            AccessToken = tokenProviderUtility.Create(userResult.Data.UserId, userResult.Data.Email),
            RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes)
        };

        await repository.CreateNewRefreshTokenHashByUserIdAsync(userResult.Data.UserId,
            refreshTokenBytes, DateTime.UtcNow.AddDays(refreshTokenLifeInDays));

        // return tokens for cookies
        return Result<Tokens, Error>.Success(tokens);
    }





    // Create Operations


    public async Task<Result<Tokens, Error>> CreateNewUserAsync(NewUserDTO newUser)
    {
        string passwordHash = PasswordUtility.HashPassword(newUser.Password);

        var userSaved = await repository.CreateNewUserAsync(newUser.Name, newUser.Email, passwordHash); 

        if (!userSaved.Successful || userSaved.Data is null)
        {
            return Result<Tokens, Error>.Failed(userSaved.Error); 
        }

        byte[] refreshTokenBytes = RefreshTokenUtility.GenerateRefreshTokenAsByteArray();

        Tokens tokens = new Tokens
        {
            AccessToken = tokenProviderUtility.Create(userSaved.Data.UserId, newUser.Email),
            RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes)
        };

        await repository.CreateNewRefreshTokenHashByUserIdAsync(userSaved.Data.UserId,
            refreshTokenBytes, DateTime.UtcNow.AddDays(refreshTokenLifeInDays));

        return Result<Tokens, Error>.Success(tokens); 
    }




    // Update operations

    public async Task<Result<Tokens, Error>> UpdateRefreshTokenAsync(HttpContext httpContext)
    {
        // get refresh token from httpcontext 
        var refreshTokenInBase64 = cookiesUtility.GetRefreshTokenFromHttpContext(httpContext);

        if (refreshTokenInBase64 == null)
        {
            logger.LogWarning("Unable to find refresh token in cookies"); 
            return Result<Tokens,Error>.Failed(Error.BadRequest);
        }

        // get user details by refreshtoken 
        var userAndRefreshTokenResult = await repository.GetUserAndRefreshToken(refreshTokenInBase64);
        var (user, refreshToken) = userAndRefreshTokenResult.Data; 

        if (!userAndRefreshTokenResult.Successful || user == null || refreshToken == null)
        {
            return Result<Tokens, Error>.Failed(userAndRefreshTokenResult.Error);
        }

        // check if refreshtoken is expired
        if (refreshToken.ExpiresAt < DateTime.UtcNow)
        {
            logger.LogWarning("Refresh token expired for user with email: {Email}", user.Email); 
            return Result<Tokens, Error>.Failed(Error.Unauthorized); 
        }

        // Verify refresh tokens 
        if (!RefreshTokenUtility.VerifyBase64RefreshTokenHash(refreshToken.TokenHash, refreshTokenInBase64))
        {
            logger.LogWarning("Invalid refresh token of user with email: {Email}", user.Email); 
            return Result<Tokens, Error>.Failed(Error.Unauthorized); 
        }

        // create new refresh token and jwt 
        byte[] refreshTokenBytes = RefreshTokenUtility.GenerateRefreshTokenAsByteArray();

        Tokens tokens = new Tokens
        {
            AccessToken = tokenProviderUtility.Create(user.UserId, user.Email),
            RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes),
            RefreshTokenExpiresAt = refreshToken.ExpiresAt
        }; 

        await repository.CreateNewRefreshTokenHashByUserIdAsync(user.UserId,
            refreshTokenBytes, DateTime.UtcNow.AddDays(refreshTokenLifeInDays));

        // return tokens 
        return Result<Tokens, Error>.Success(tokens);
    }




    // Delete operations


    public async Task<Result<Error>> LogoutUserAsync(HttpContext httpContext)
    {
        string? refreshTokenInBase64 = cookiesUtility.GetRefreshTokenFromHttpContext(httpContext);

        if (refreshTokenInBase64 == null)
        {
            return Result<Error>.Success(); 
        }

        await repository.DeleteRefreshTokenHashAsync(refreshTokenInBase64);

        return Result<Error>.Success();
    }


}
