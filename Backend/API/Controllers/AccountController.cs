using API.DTOs.Account;
using API.Services.Account;
using API.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            cookiesUtility.SetTokensInsideCookies(HttpContext, result.Data); 
            return Ok(); 
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
            cookiesUtility.SetTokensInsideCookies(HttpContext, result.Data); 
            return Ok();
        }
        else
        {
            return result.Error.ErrorToActionResult();
        }
    }


    [HttpPost]
    public async Task<IActionResult> LogoutUserPostAsync()
    {
        throw new NotImplementedException();
    }




    [HttpGet("/api/hello")]
    public IActionResult HelloGet()
    {
        return Ok(new { message = "Hello, from API" }); 
    }

}
