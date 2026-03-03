using API.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers; 

[Route("api/[controller]")]
[ApiController]
public class BoardController : ControllerBase
{
    private ILogger<BoardController> logger;
    private CookiesUtility cookiesUtility; 

}
