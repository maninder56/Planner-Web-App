using API.DTOs.Account.Requests;
using API.Exceptions;
using API.Models.Account;
using API.Models.Result;
using API.Repositories.Account;
using API.Utilities;
using DatabaseContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

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


    public async Task<Result<Tokens>> LogInUserAsync(LogInUserRequest logInUser)
    {
        try
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
            string base64TokenHash = RefreshTokenUtility.ConvertTokenBytesToBase64Hash(refreshTokenBytes);

            Tokens tokens = new Tokens
            {
                AccessToken = tokenProviderUtility.Create(user.UserId, user.Email),
                RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes)
            };


            await repository.CreateNewRefreshTokenAsync(user.UserId, base64TokenHash, 
                DateTime.UtcNow.AddDays(refreshTokenLifeInDays));

            // return tokens for cookies
            return Result<Tokens>.Success(tokens);
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning("Failed to log user in, Exception message {ExceptionMessage}", ex.Message);
            return Result<Tokens>.Failed(ErrorType.NotFound, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to log user in, an unexpected error occured Exception message {ExceptionMessage}", ex.Message);
            return Result<Tokens>.Failed(ErrorType.InternalServerError, "Unexptected Error"); 
        }
    }





    // Create Operations


    public async Task<Result<Tokens>> CreateNewUserAsync(NewUserRequest newUser)
    {
        try
        {
            string passwordHash = PasswordUtility.HashPassword(newUser.Password);

            var userSaved = await repository.CreateNewUserAsync(newUser.Name, newUser.Email, passwordHash);

            if (userSaved is null)
            {
                logger.LogWarning("Failed to save new user user: {Email}", newUser.Email);
                return Result<Tokens>.Failed(ErrorType.InternalServerError, "Server Error");
            }

            // Create tokens
            byte[] refreshTokenBytes = RefreshTokenUtility.GenerateRefreshTokenAsByteArray();
            string base64TokenHash = RefreshTokenUtility.ConvertTokenBytesToBase64Hash(refreshTokenBytes);

            Tokens tokens = new Tokens
            {
                AccessToken = tokenProviderUtility.Create(userSaved.UserId, userSaved.Email),
                RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes)
            };

            await repository.CreateNewRefreshTokenAsync(userSaved.UserId, base64TokenHash, 
                DateTime.UtcNow.AddDays(refreshTokenLifeInDays));

            return Result<Tokens>.Success(tokens);
        }
        catch (DbUpdateException ex) when (ex.GetBaseException() is MySqlException { Number: 1062 })
        {
            logger.LogWarning("User provided email which is already likned to an account, Email: {Email}", newUser.Email); 
            return Result<Tokens>.Failed(ErrorType.Conflict, 
                "Duplicate value", "A record with this value already exists"); 
        } 
        catch (NotFoundException ex)
        {
            logger.LogWarning("Failed to create new user, resource not found, Exception message {ExceptionMessage}", ex.Message);
            return Result<Tokens>.Failed(ErrorType.NotFound, ex.Message);
        }
        catch(Exception ex)
        {
            logger.LogWarning("Error occured while saving new user, User Email: {Email} Error Message: {ErrorMessage}", 
                newUser.Email, ex.Message); 
            return Result<Tokens>.Failed(ErrorType.InternalServerError, "An Unexpected error occured"); 
        }
    }




    // Update operations

    public async Task<Result<Tokens>> UpdateRefreshTokenAsync(string refreshTokenInBase64)
    {
        try
        {
            string base64TokenHash = RefreshTokenUtility.ConvertBase64ToBase64Hash(refreshTokenInBase64);

            // get user details by refreshtoken 
            var userAndRefreshTokenResult = await repository.GetUserAndRefreshToken(base64TokenHash);

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
            string newBase64TokenHash = RefreshTokenUtility.ConvertTokenBytesToBase64Hash(refreshTokenBytes);

            Tokens tokens = new Tokens
            {
                AccessToken = tokenProviderUtility.Create(user.UserId, user.Email),
                RefreshToken = RefreshTokenUtility.Encode(refreshTokenBytes),
                RefreshTokenExpiresAt = refreshToken.ExpiresAt
            };

            await repository.UpdateRefreshTokenAsync(refreshToken.RefreshTokenId, newBase64TokenHash);

            // return tokens 
            return Result<Tokens>.Success(tokens);
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning("Failed to update refresh token, resource not found, Exception message {ExceptionMessage}", 
                ex.Message);
            return Result<Tokens>.Failed(ErrorType.NotFound, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Error occured while updating refresh token, Error Message: {ErrorMessage}", ex.Message);
            return Result<Tokens>.Failed(ErrorType.InternalServerError, "An Unexpected error occured");
        }
    }





    public async Task<Result> ChangeUserPassword(int userId, string oldPassword, string newPassword)
    {
        try
        {
            User? user = await repository.GetUserById(userId); 

            if (user is null)
            {
                return Result.Failed(ErrorType.NotFound, "User not found"); 
            }

            // verify password 
            if (!PasswordUtility.VerifyPassword(user.PasswordHash, oldPassword))
            {
                logger.LogWarning("Failed to update user password, old password incorrect. User ID: {Id}", userId);
                return Result.Failed(ErrorType.BadRequest, "Invalid User Credentials");
            }

            string newPasswordHash = PasswordUtility.HashPassword(newPassword);

            await repository.UpdateUserPassword(userId, newPasswordHash);

            await repository.DeleteRefreshTokenAsync(userId);

            return Result.Success(); 
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning("Failed to update user password, user not found");
            return Result.Failed(ErrorType.NotFound, ex.Message); 
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to updae user password, Exception message {ExceptionMessage}", ex.Message);
            return Result.Failed(ErrorType.InternalServerError, "Unexpected Error"); 
        }
    }




    // Delete operations

    public async Task<Result> LogoutUserAsync(string refreshTokenInBase64)
    {
        string base64TokenHash = RefreshTokenUtility.ConvertBase64ToBase64Hash(refreshTokenInBase64);

        await repository.DeleteRefreshTokenAsync(base64TokenHash);

        return Result.Success(); 
    }

 
}
