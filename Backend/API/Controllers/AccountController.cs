using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers; 

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{

    [HttpGet("hello")]
    public IActionResult HelloGet()
    {
        return Ok(new { message = "Hello, from API" }); 
    }

}
