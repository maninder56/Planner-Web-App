using API.DTOs.Invitation.Requests;
using DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers; 

[Route("api/[controller]")]
[ApiController]
public class InvitationController(
    IAuthorizationService authorizationService) : ControllerBase
{

    [HttpPost]
    public async Task<IActionResult> InviteUser(BoardInviteRequest request)
    {
        var authResult = await authorizationService.AuthorizeAsync(
            User, request.BoardId, "CanShareBoard");

        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        throw new NotImplementedException();
    }
}
