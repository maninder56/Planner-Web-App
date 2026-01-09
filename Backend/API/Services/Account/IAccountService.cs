using API.DTOs.Account;
using API.Models.Account;
using API.Models.Result;

namespace API.Services.Account; 

public interface IAccountService
{

    // Create operations
    public Task<Result<CreatedUser, Tokens, Error>> CreateNewUserAsync(NewUserDTO newUser); 
}
