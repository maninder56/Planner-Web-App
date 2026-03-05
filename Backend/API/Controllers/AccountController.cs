using API.DTOs.Account;
using API.Services.Account;
using API.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Threading.Tasks;

namespace API.Controllers; 

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{

    private ILogger<AccountController> logger; 
    private IAccountService accountService;
    private CookiesUtility cookiesUtility; 

    public AccountController(ILogger<AccountController> logger, IAccountService accountService, CookiesUtility cookiesUtility)
    {
        this.logger = logger;
        this.accountService = accountService;
        this.cookiesUtility = cookiesUtility;
    }


    
    // Account Routes

    [HttpPost("create")]
    public async Task<IActionResult> CreateAccountPostAsync(NewUserDTO newUser)
    {
        var result = await accountService.CreateNewUserAsync(newUser);

        if (result.Successful && result.Data != null)
        {
            cookiesUtility.SetNewTokensInsideCookies(HttpContext, result.Data);

            logger.LogInformation("User with email {email} successfully logged in at {time}",
                newUser.Email, DateTime.UtcNow.ToString());

            return NoContent(); 
        }
        else
        {
            return result.Error.ErrorToActionResult();
        }
    }


    [HttpPost("login")]
    public async Task<IActionResult> LogInUserPostAsync(LogInUserDTO logInUser)
    {
        var result = await accountService.LogInUserAsync(logInUser); 

        if (result.Successful && result.Data != null)
        {
            cookiesUtility.SetNewTokensInsideCookies(HttpContext, result.Data);

            logger.LogInformation("User with email {email} successfully logged in at {time}", 
                logInUser.Email, DateTime.UtcNow.ToString());
            return NoContent();
        }
        else
        {
            return result.Error.ErrorToActionResult();
        }
    }


    [HttpPost("logout")]
    public async Task<IActionResult> LogoutUserPostAsync()
    {
        await accountService.LogoutUserAsync(HttpContext);
        cookiesUtility.InvalidateCookies(HttpContext);

        return NoContent(); 
    }

    [HttpPost("token/refresh")]
    public async Task<IActionResult> RefreshTokenPostAsync()
    {
        var tokenResult = await accountService.UpdateRefreshTokenAsync(HttpContext);

        if (tokenResult.Successful && tokenResult.Data != null)
        {
            cookiesUtility.UpdateTokensInsideCookies(HttpContext, tokenResult.Data);
            return NoContent();
        }
        else
        {
            return tokenResult.Error.ErrorToActionResult();
        }
    }




    [HttpGet("/api/hello")]
    public IActionResult HelloGet()
    {
        return Ok(new { message = "Hello, from API" }); 
    }

}
