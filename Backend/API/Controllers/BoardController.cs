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
public class BoardController : ControllerBase
{
    private ILogger<BoardController> logger;
    private CookiesUtility cookiesUtility; 
    private IBoardService boardService;

    public BoardController(
        ILogger<BoardController> logger, 
        CookiesUtility cookiesUtility, 
        IBoardService boardService)
    {
        this.logger = logger;
        this.cookiesUtility = cookiesUtility;
        this.boardService = boardService;
    }

    [HttpGet("lastusedboard")]
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


    [HttpGet("{id}")]
    public async Task<IActionResult> GetBoardAsync(int id)
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


    [HttpPost("create")]
    public async Task<IActionResult> CreateNewBoard(NewBoardRequest newBoardRequest)
    {
        throw new NotImplementedException();
    }
}
