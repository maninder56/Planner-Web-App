using API.DTOs.Invitation.Requests;
using API.Extensions;
using API.Services.InvitationService;
using API.Utilities;
using DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize] 
[Route("api/[controller]")]
[ApiController]
public class InvitationController(
    IAuthorizationService authorizationService, 
    IInvitationService invitationService) : ControllerBase
{

    // GET requests
    [HttpGet("received")]
    public async Task<IActionResult> GetInvitationsReceived()
    {
        throw new NotImplementedException();
    }
    


    // POST requests

    [HttpPost]
    public async Task<IActionResult> InviteUser(BoardInviteRequest request)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, request.BoardId, "CanShareBoard");

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var result = await invitationService.InviteUserToBoardAsync(request, User.GetUserId()); 

        if (result.Successful)
        {
            return NoContent(); 
        }
        else
        {
            return result.Error.ErrorToActionResult(); 
        }
    }
}
