using API.DTOs.Invitation.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers; 

[Route("api/[controller]")]
[ApiController]
public class InvitationController : ControllerBase
{

    [HttpPost]
    public async Task<IActionResult> InviteUser(BoardInviteRequest request)
    {
        throw new NotImplementedException();
    }
}
