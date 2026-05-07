using API.DTOs.Account.Requests;
using API.Models.Account;
using API.Models.Result;

namespace API.Services.Account; 

public interface IAccountService
{
    // Read operations
    public Task<Result<Tokens>> LogInUserAsync(LogInUserRequest logInUser); 

    // Create operations
    public Task<Result<Tokens>> CreateNewUserAsync(NewUserRequest newUser);

    // Update operations 
    public Task<Result<Tokens>> UpdateRefreshTokenAsync(string refreshTokenInBase64);
    public Task<Result> ChangeUserPassword(int userId, string oldPassword, string newPassword);
    public Task<Result> SendResetPasswordEmailAsync(string email);
    public Task<Result> ResetPasswordAsync(ResetPasswordRequest request); 

    // delete operations
    public Task<Result> LogoutUserAsync(string refreshTokenInBase64); 
}
