using API.Models.Result;
using API.Services.ProfileService;
using API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[Route("api/account/[controller]")]
[ApiController]
public class ProfileController (ILogger<ProfileController> logger, CookiesUtility cookiesUtility, IProfileService profileService)
    : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetUserProfileInfo()
    {
        int? userId = await cookiesUtility.GetUserIdFromHttpContextAsync(HttpContext);

        if (userId is null)
        {
            logger.LogWarning("Unable to find user id from access tokens");
            Error error = new Error(ErrorType.BadRequest, "User id not found",
                "Unable to find user");
            return error.ErrorToActionResult();
        }

        var profileResult = await profileService.GetUserProfileInfoAsync((int)userId);

        if (profileResult.Successful)
        {
            return Ok(profileResult.Data); 
        }
        else
        {
            return profileResult.Error.ErrorToActionResult(); 
        }
    }
}
