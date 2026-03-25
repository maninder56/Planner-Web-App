using API.DTOs.Board.Requests;
using API.DTOs.Card.Requests;
using API.Extensions;
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
[Route("api/boards/{boardId}/lists/{listId}/[controller]")]
[ApiController]
public class CardsController(
    ILogger<CardsController> logger,
    ICardService cardService, 
    IAuthorizationService authorizationService) : ControllerBase
{
    
    // Cards Endpoints

    [HttpGet("/api/cards")]
    public async Task<IActionResult> SearchCardByKeyword([FromQuery] string? search)
    {
        var decodedSearch = HttpUtility.UrlDecode(search);

        if (decodedSearch is null)
        {
            logger.LogWarning("No search keyword provided in search query");
            Error error = new Error(ErrorType.BadRequest, "No keyword provided for search");
            return error.ErrorToActionResult();
        }

        var searchResult = await cardService.SearchCardByKeyword(
            User.GetUserId(), decodedSearch);

        if (searchResult.Successful)
        {
            return Ok(searchResult.Data);
        }
        else
        {
            return searchResult.Error.ErrorToActionResult();
        }
    }

    // Post 

    [HttpPost]
    public async Task<IActionResult> CreateNewCardAsync(int boardId, int listId, NewCardRequest request)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, boardId, "CanEditBoard");

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var newCardResult = await cardService.CreateNewCardAsync(boardId, listId, request);

        if (newCardResult.Successful)
        {
            return Ok(newCardResult.Data);
        }
        else
        {
            return newCardResult.Error.ErrorToActionResult();
        }
    }


    // Patch

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateCardInfo(int boardId, int listId, int id, UpdateCardRequest request)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, boardId, "CanEditBoard"); 

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var updateResult = await cardService.UpdateCardInfo(boardId, listId, id, request);

        if (updateResult.Successful)
        {
            return Ok(updateResult.Data);
        }
        else
        {
            return updateResult.Error.ErrorToActionResult();
        }
    }


    [HttpPatch("/api/boards/{boardId}/cards/re-order")]
    public async Task<IActionResult> UpdateCardOrder(int boardId, UpdateCardOrderRequest request)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, boardId, "CanEditBoard");

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var updateResult = await cardService.UpdateCardOrderAsync(boardId, request);

        if (updateResult.Successful)
        {
            return NoContent(); 
        }
        else
        {
            return updateResult.Error.ErrorToActionResult();
        }
    }
    

}
