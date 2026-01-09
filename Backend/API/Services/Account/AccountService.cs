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
    
    public AccountService(ILogger<AccountService> logger, IAccountRepository repository, IConfiguration configuration, TokenProviderUtility tokenProviderUtility, CookiesUtility cookiesUtility)
    {
        this.logger = logger;
        this.repository = repository;
        this.tokenProviderUtility = tokenProviderUtility;
        this.configuration = configuration;
        this.cookiesUtility = cookiesUtility;
        
        refreshTokenLifeInDays = configuration.GetValue<int>("RefreshToken:ExpirationInDays", cookiesUtility.GetRefreshTokenLifeInDaysDefaultValue());
    }


    // Create Operations

    public async Task<Result<CreatedUser, Tokens, Error>> CreateNewUserAsync(NewUserDTO newUser)
    {
        string passwordHash = PasswordUtility.HashPassword(newUser.Password);

        var userSaved = await repository.CreateNewUserAsync(newUser.Name, newUser.Email, passwordHash); 

        if (!userSaved.Successful || userSaved.Data is null)
        {
            return Result<CreatedUser, Tokens, Error>.Failed(userSaved.Error); 
        }

        byte[] refreshTokenBytes = RefreshTokenUtility.GenerateRefreshTokenAsByteArray();

        Tokens tokens = new Tokens
        {
            AccessToken = tokenProviderUtility.Create(userSaved.Data.UserId, newUser.Email),
            RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes)
        };

        await repository.CreateNewRefreshTokenHashByUserIdAsync(userSaved.Data.UserId,
            refreshTokenBytes, DateTime.UtcNow.AddDays(refreshTokenLifeInDays));

        return Result<CreatedUser, Tokens, Error>.Success(userSaved.Data, tokens); 
    }

}
