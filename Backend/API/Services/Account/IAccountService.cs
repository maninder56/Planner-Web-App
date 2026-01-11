using API.DTOs.Account;
using API.Models.Account;
using API.Models.Result;

namespace API.Services.Account; 

public interface IAccountService
{
    // Read operations
    public Task<Result<Tokens, Error>> LogInUserAsync(LogInUserDTO logInUser); 

    // Create operations
    public Task<Result<Tokens, Error>> CreateNewUserAsync(NewUserDTO newUser); 
}
