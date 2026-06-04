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

    // Get Requests

    [HttpGet("order")]
    public async Task<IActionResult> GetListOrder(int boardId)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, boardId, "CanEditBoard");

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var listOrderResult = await listService.GetListOrderAsync(boardId);

        if (listOrderResult.Successful)
        {
            return Ok(listOrderResult.Data); 
        }
        else
        {
            return listOrderResult.Error.ErrorToActionResult(); 
        }
    }



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

        int userID = User.GetUserId(); 

        var newListResult = await listService.CreateNewListAsync(userID, boardId, request);

        if (newListResult.Successful)
        {
            return Ok(newListResult.Data); 
        }
        else
        {
            return newListResult.Error.ErrorToActionResult(); 
        }
    }

    // Patch requests

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateListInfoAsync(int boardId, int id, ChangeListInfoRequest request)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, boardId, "CanEditBoard");

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var changedList = await listService.UpdateListInfo(boardId, id, request);

        if (changedList.Successful)
        {
            return Ok(changedList.Data);
        }
        else
        {
            return changedList.Error.ErrorToActionResult();
        }
    }


    // Put requests
    
    [HttpPut("re-order")]
    public async Task<IActionResult> UpdateListOrderAsync(int boardId, ChangeListOrderRequest request)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, boardId, "CanEditBoard");

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var listOrderResult = await listService.UpdateListOrderAsync(boardId, request);

        if (listOrderResult.Successful)
        {
            return NoContent();
        }
        else
        {
            return listOrderResult.Error.ErrorToActionResult();
        }
    }



    // Delete requests 


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteListAsync(int boardId, int id)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, boardId, "CanEditBoard");

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var deleteListResult = await listService.DeleteList(boardId, id);

        if (deleteListResult.Successful)
        {
            return NoContent();
        }
        else
        {
            return deleteListResult.Error.ErrorToActionResult();
        }
    }


}
