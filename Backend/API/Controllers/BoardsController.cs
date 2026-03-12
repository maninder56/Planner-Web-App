using API.DTOs.Board.Requests;
using API.Models.Result;
using API.Queries.Boards;
using API.Services.BoardService;
using API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class BoardsController : ControllerBase
{
    private ILogger<BoardsController> logger;
    private CookiesUtility cookiesUtility; 
    private IBoardService boardService;

    public BoardsController(
        ILogger<BoardsController> logger, 
        CookiesUtility cookiesUtility, 
        IBoardService boardService)
    {
        this.logger = logger;
        this.cookiesUtility = cookiesUtility;
        this.boardService = boardService;
    }


    // Board Endpoints


    [HttpGet]
    public async Task<IActionResult> GetAllBoards()
    {
        int? userId = await cookiesUtility.GetUserIdFromHttpContextAsync(HttpContext);

        if (userId is null)
        {
            logger.LogWarning("Unable to find user id from access tokens");
            Error error = new Error(ErrorType.BadRequest, "User id not found",
                "Unable to find user");
            return error.ErrorToActionResult();
        }

        var boardListResult = await boardService.GetAllBoards((int)userId);

        if (boardListResult.Successful)
        {
            return Ok(boardListResult.Data);
        }
        else
        {
            return boardListResult.Error.ErrorToActionResult(); 
        }
    }


    [HttpPost]
    public async Task<IActionResult> CreateNewBoard([FromBody] NewBoardRequest newBoardRequest)
    {
        int? userId = await cookiesUtility.GetUserIdFromHttpContextAsync(HttpContext);

        if (userId is null)
        {
            logger.LogWarning("Unable to find user id from access tokens");
            Error error = new Error(ErrorType.BadRequest, "User id not found",
                "Unable to find user");
            return error.ErrorToActionResult();
        }

        var savedBoardResult = await boardService.CreateNewBoardAsync((int)userId, newBoardRequest);

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



    [HttpGet("{id}", Name = "GetBoardById")]
    public async Task<IActionResult> GetBoardByIdAsync(int id)
    {
        int? userId = await cookiesUtility.GetUserIdFromHttpContextAsync(HttpContext);

        if (userId is null)
        {
            logger.LogWarning("Unable to find user id from access tokens");
            Error error = new Error(ErrorType.BadRequest, "User id not found",
                "Unable to find user");
            return error.ErrorToActionResult();
        }

        var boardDataResult = await boardService.GetBoardDataAsync((int)userId, id);

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
        int? userId = await cookiesUtility.GetUserIdFromHttpContextAsync(HttpContext); 

        if (userId is null)
        {
            logger.LogWarning("Unable to find user id from access tokens");
            Error error = new Error(ErrorType.BadRequest, "User id not found",
                "Unable to find user");
            return error.ErrorToActionResult();
        }

        var boardDataResult = await boardService.GetLastUsedBoardDataAsync((int)userId);

        if (boardDataResult.Successful)
        {
            return Ok(boardDataResult.Data);
        }
        else
        {
            return boardDataResult.Error.ErrorToActionResult(); 
        }
    }

}
