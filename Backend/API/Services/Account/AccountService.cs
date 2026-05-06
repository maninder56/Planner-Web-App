using API.DTOs.Account.Requests;
using API.Exceptions;
using API.Models.Account;
using API.Models.EmailSettings;
using API.Models.Result;
using API.Repositories.Account;
using API.Services.EmailService;
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
    private IEmailService emailService; 

    private int refreshTokenLifeInDays;
    private int passwordResetTokenLifeInMinutes; 

    public AccountService(
        ILogger<AccountService> logger, IAccountRepository repository,
        IConfiguration configuration, TokenProviderUtility tokenProviderUtility,
        CookiesUtility cookiesUtility, IEmailService emailService)
    {
        this.logger = logger;
        this.repository = repository;
        this.tokenProviderUtility = tokenProviderUtility;
        this.configuration = configuration;
        this.cookiesUtility = cookiesUtility;
        this.emailService = emailService; 
        

        refreshTokenLifeInDays = configuration.GetValue<int>(
            "RefreshToken:ExpirationInDays",
            cookiesUtility.GetRefreshTokenLifeInDaysDefaultValue()
        );


        passwordResetTokenLifeInMinutes = configuration.GetValue<int>(
            "PasswordResetToken:ExpirationInMinutes", 
            15
        );
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
            byte[] refreshTokenBytes = TokenUtility.GenerateTokenAsByteArray();
            string base64TokenHash = TokenUtility.ConvertTokenBytesToBase64Hash(refreshTokenBytes);

            Tokens tokens = new Tokens
            {
                AccessToken = tokenProviderUtility.Create(user.UserId, user.Email),
                RefreshToken = TokenUtility.Encode(refreshTokenBytes)
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
            byte[] refreshTokenBytes = TokenUtility.GenerateTokenAsByteArray();
            string base64TokenHash = TokenUtility.ConvertTokenBytesToBase64Hash(refreshTokenBytes);

            Tokens tokens = new Tokens
            {
                AccessToken = tokenProviderUtility.Create(userSaved.UserId, userSaved.Email),
                RefreshToken = TokenUtility.Encode(refreshTokenBytes)
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
            string base64TokenHash = TokenUtility.ConvertBase64ToBase64Hash(refreshTokenInBase64);

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
            if (!TokenUtility.VerifyBase64TokenHash(refreshToken.TokenHash, refreshTokenInBase64))
            {
                logger.LogWarning("Invalid refresh token of user with email: {Email}", user.Email);
                return Result<Tokens>.Failed(ErrorType.Unauthorized, "Invalid Refresh token");
            }

            // create new refresh token and jwt 
            byte[] refreshTokenBytes = TokenUtility.GenerateTokenAsByteArray();
            string newBase64TokenHash = TokenUtility.ConvertTokenBytesToBase64Hash(refreshTokenBytes);

            Tokens tokens = new Tokens
            {
                AccessToken = tokenProviderUtility.Create(user.UserId, user.Email),
                RefreshToken = TokenUtility.Encode(refreshTokenBytes),
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





    public async Task<Result> SendResetPasswordEmailAsync(string email)
    {
        try
        {
            var userAndToken = await repository.GetUserAndPasswordResetToken(email);

            if (userAndToken is null)
            {
                return Result.Success(); 
            }

            (User user, PasswordResetToken? token) = userAndToken.Value; 

            // If token exits; same user can not make another request within 2 minutes
            if (token is not null && token.CreatedAt >= DateTime.UtcNow.AddMinutes(-2))
            {
                return Result.Success();
            }

            // Delete all the previous tokes of this user
            await repository.DeleteAllPasswordResetTokensAsync(user.UserId); 

            // generate token and save it as hash
            byte[] tokenBytes = TokenUtility.GenerateTokenAsByteArray();
            string newBase64TokenHash = TokenUtility.ConvertTokenBytesToBase64Hash(tokenBytes);

            await repository.CreateNewPasswordResetTokenAsync(user.UserId, newBase64TokenHash, 
                DateTime.UtcNow.AddMinutes(passwordResetTokenLifeInMinutes));

            // send email to provided email; add email and token as query in link
            string resetLink = "https://i.pinimg.com/1200x/c3/5c/45/c35c4516c4d7eda5ac9a39c8d8b79151.jpg"; 
            await emailService.SendPasswordResetEmailAsync(email, resetLink); 

            return Result.Success();

        } 
        catch (Exception ex)
        {
            logger.LogWarning("Failed to send reset password email to: {Email}, Exception message {ExceptionMessage}", 
               email, ex.Message);
            return Result.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }




    // Delete operations

    public async Task<Result> LogoutUserAsync(string refreshTokenInBase64)
    {
        string base64TokenHash = TokenUtility.ConvertBase64ToBase64Hash(refreshTokenInBase64);

        await repository.DeleteRefreshTokenAsync(base64TokenHash);

        return Result.Success(); 
    }

 
}
