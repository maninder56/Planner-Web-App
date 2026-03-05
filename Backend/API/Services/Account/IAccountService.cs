using API.DTOs.Account;
using API.Models.Account;
using API.Models.Result;

namespace API.Services.Account; 

public interface IAccountService
{
    // Read operations
    public Task<Result<Tokens>> LogInUserAsync(LogInUserDTO logInUser); 

    // Create operations
    public Task<Result<Tokens>> CreateNewUserAsync(NewUserDTO newUser);

    // Update operations 
    public Task<Result<Tokens>> UpdateRefreshTokenAsync(HttpContext httpContext); 

    // delete operations
    public Task<Result> LogoutUserAsync(HttpContext httpContext); 
}
