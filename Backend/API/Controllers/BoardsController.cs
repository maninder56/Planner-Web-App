using API.DTOs.Board.Requests;
using API.Extensions;
using API.Models.Result;
using API.Queries.Boards;
using API.Repositories.BoardRepository;
using API.Services.BoardService;
using API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;

namespace API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class BoardsController : ControllerBase
{
    private ILogger<BoardsController> logger;
    private CookiesUtility cookiesUtility; 
    private IBoardService boardService;
    private IAuthorizationService authorizationService;

    public BoardsController(
        ILogger<BoardsController> logger, 
        CookiesUtility cookiesUtility, 
        IBoardService boardService, 
        IAuthorizationService authorizationService)
    {
        this.logger = logger;
        this.cookiesUtility = cookiesUtility;
        this.boardService = boardService;
        this.authorizationService = authorizationService;
    }


    
    // GET Requests

    [HttpGet]
    public async Task<IActionResult> GetAllBoards()
    {
        int userId = User.GetUserId();

        var boardListResult = await boardService.GetAllBoards(userId);

        if (boardListResult.Successful)
        {
            return Ok(boardListResult.Data);
        }
        else
        {
            return boardListResult.Error.ErrorToActionResult(); 
        }
    }



    [HttpGet("{id}", Name = "GetBoardById")]
    public async Task<IActionResult> GetBoardByIdAsync(int id)
    {
        int userId = User.GetUserId();

        var boardDataResult = await boardService.GetBoardDataAsync(userId, id);

        if (boardDataResult.Successful)
        {
            return Ok(boardDataResult.Data);
        }
        else
        {
            return boardDataResult.Error.ErrorToActionResult();
        }
    }


    [HttpGet("last-used")]
    public async Task<IActionResult> GetLastUsedBoardAsync()
    {
        int userId = User.GetUserId();

        var boardDataResult = await boardService.GetLastUsedBoardDataAsync(userId);

        if (boardDataResult.Successful)
        {
            return Ok(boardDataResult.Data);
        }
        else
        {
            return boardDataResult.Error.ErrorToActionResult();
        }
    }





    // POST Requests


    [HttpPost]
    public async Task<IActionResult> CreateNewBoard([FromBody] NewBoardRequest newBoardRequest)
    {
        int userId = User.GetUserId();

        var savedBoardResult = await boardService.CreateNewBoardAsync(userId, newBoardRequest);

        if (savedBoardResult.Successful)
        {
            int? boardId = savedBoardResult.Data?.BoardId;

            if (boardId is int id)
            {
                return CreatedAtAction("GetBoardById", new { id = id }, savedBoardResult.Data);
            }
            else
            {
                return Created("GetBoardById", savedBoardResult.Data);
            }
        }
        else
        {
            return savedBoardResult.Error.ErrorToActionResult();
        }
    }



    // Patch Requests

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateBoardInfo(int id, BoardInfoChangeRequest request)
    {
        int userId = User.GetUserId(); 

        var authResult = await authorizationService.AuthorizeAsync(
            User, id, "CanEditBoard");

        if (!authResult.Succeeded)
        {
            return Forbid(); 
        }

        var boardInfoChangeResult = await boardService.UpdateBoardInfoAsync(userId, id, request); 

        if (boardInfoChangeResult.Successful)
        {
            return Ok(boardInfoChangeResult.Data);
        }
        else
        {
            return boardInfoChangeResult.Error.ErrorToActionResult();
        }
    }

    [HttpPatch("last-used")]
    public async Task<IActionResult> UpdateUsedBoard(LastUsedBoardChangeRequest request)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, request.LastUsedBoardId, "CanViewBoard"); 

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        int userId = User.GetUserId();

        var updateResult = await boardService.UpdateLastUsedBoardAsync(userId, request);

        if (updateResult.Successful)
        {
            return NoContent(); 
        }
        else
        {
            return updateResult.Error.ErrorToActionResult();
        }
    }




    // Delete requests

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBoardAsync(int id)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, id, "CanDeleteBoard"); 

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var deleteResult = await boardService.DeleteBoardAsync(id);

        if (deleteResult.Successful)
        {
            return NoContent(); 
        }
        else
        {
            return deleteResult.Error.ErrorToActionResult();
        }
    }

}
