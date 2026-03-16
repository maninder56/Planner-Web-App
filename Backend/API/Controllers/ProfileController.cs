using API.DTOs.Profile.Requests;
using API.Extensions;
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
        int userId = User.GetUserId();

        var profileResult = await profileService.GetUserProfileInfoAsync(userId);

        if (profileResult.Successful)
        {
            return Ok(profileResult.Data); 
        }
        else
        {
            return profileResult.Error.ErrorToActionResult(); 
        }
    }

    [HttpPatch]
    public async Task<IActionResult> UpdateUserName(NameChangeRequest nameChangeRequest)
    {
        int userId = User.GetUserId();

        var nameChangeResult = await profileService.UpdateUserNameAsync(userId,nameChangeRequest.Name); 

        if (nameChangeResult.Successful)
        {
            return NoContent();
        }
        else
        {
            return nameChangeResult.Error.ErrorToActionResult();
        }
    }


    [HttpDelete]
    public async Task<IActionResult> DeleteProfile()
    {
        int userId = User.GetUserId();

        var deleteProfileResult = await profileService.DeleteProfileAsync(userId);

        if (deleteProfileResult.Successful)
        {
            cookiesUtility.InvalidateCookies(HttpContext); 
            return NoContent();
        }
        else
        {
            return deleteProfileResult.Error.ErrorToActionResult();
        }
    }
}
