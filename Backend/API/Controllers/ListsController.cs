using API.DTOs.List.Requests;
using API.Extensions;
using API.Services.ListService;
using API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[Route("api/boards/{boardId}/[controller]")]
[ApiController]
public class ListsController(
    //ILogger<ListsController> logger, 
    IListService listService, 
    IAuthorizationService authorizationService) : ControllerBase
{

    // Post Requests 

    [HttpPost]
    public async Task<IActionResult> CreateNewListAsync(int boardId, NewListRequest request)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, boardId, "CanEditBoard"); 

        if (!authResult.Succeeded)
        {
            return Forbid(); 
        }

        var newListResult = await listService.CreateNewListAsync(boardId, request);

        if (newListResult.Successful)
        {
            return Ok(newListResult.Data); 
        }
        else
        {
            return newListResult.Error.ErrorToActionResult(); 
        }
    }
}
