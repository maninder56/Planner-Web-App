using API.DTOs.Account;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers; 

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{

    private ILogger logger; 

    public AccountController(ILogger<AccountController> logger)
    {
        this.logger = logger;
    }


    // Read routs



    // Create routs

    [HttpPost("create")]
    public IActionResult CreateAccountPostAsync(NewUserDTO newUser)
    {
        throw new NotImplementedException();
    }



    [HttpGet("/api/hello")]
    public IActionResult HelloGet()
    {
        return Ok(new { message = "Hello, from API" }); 
    }

}
