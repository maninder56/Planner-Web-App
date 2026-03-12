using API.DTOs.Board.Requests;
using API.Models.Result;
using API.Services.BoardService;
using API.Services.CardService;
using API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Web;

namespace API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CardsController : ControllerBase
{
    private ILogger<CardsController> logger;
    private CookiesUtility cookiesUtility;
    private ICardService cardService; 
    

    public CardsController(ILogger<CardsController> logger, CookiesUtility cookiesUtility, ICardService cardService)
    {
        this.logger = logger;
        this.cookiesUtility = cookiesUtility;
        this.cardService = cardService;
    }


    // Cards Endpoints

    [HttpGet]
    public async Task<IActionResult> SearchCardByKeyword([FromQuery] string? search)
    {
        var decodedSearch = HttpUtility.UrlDecode(search);

        if (decodedSearch is null)
        {
            logger.LogWarning("No search keyword provided in search query");
            Error error = new Error(ErrorType.BadRequest, "No keyword provided for search");
            return error.ErrorToActionResult();
        }

        int? userId = await cookiesUtility.GetUserIdFromHttpContextAsync(HttpContext);

        if (userId is null)
        {
            logger.LogWarning("Unable to find user id from access tokens");
            Error error = new Error(ErrorType.BadRequest, "User id not found",
                "Unable to find user");
            return error.ErrorToActionResult();
        }

        logger.LogInformation($"uncoded search: {decodedSearch}"); 

        var searchResult = await cardService.SearchCardByKeyword(
            (int)userId, decodedSearch);

        if (searchResult.Successful)
        {
            return Ok(searchResult.Data);
        }
        else
        {
            return searchResult.Error.ErrorToActionResult();
        }
    }
}
