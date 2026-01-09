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
    private IAccountService service;
    private CookiesUtility cookiesUtility; 

    public AccountController(ILogger<AccountController> logger, IAccountService accountService, CookiesUtility cookiesUtility)
    {
        this.logger = logger;
        this.service = accountService;
        this.cookiesUtility = cookiesUtility;
    }


    // Read routs



    // Create routs

    [HttpPost("create")]
    public async Task<IActionResult> CreateAccountPostAsync(NewUserDTO newUser)
    {
        var result = await service.CreateNewUserAsync(newUser);

        if (result.Successful && result.Data2 is not null)
        {
            cookiesUtility.SetTokensInsideCookies(HttpContext, result.Data2); 
            return Ok(); 
        }
        else
        {
            return result.Error.ErrorToActionResult(); 
        }
    }



    [HttpGet("/api/hello")]
    public IActionResult HelloGet()
    {
        return Ok(new { message = "Hello, from API" }); 
    }

}
