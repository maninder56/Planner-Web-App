using API.DTOs.Account.Requests;
using API.Extensions;
using API.Models.Account;
using API.Models.Result;
using API.Services.Account;
using API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http;
using System.Threading.Tasks;

namespace API.Controllers; 

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{

    private ILogger<AccountController> logger; 
    private IAccountService accountService;
    private CookiesUtility cookiesUtility; 

    public AccountController(ILogger<AccountController> logger, IAccountService accountService, CookiesUtility cookiesUtility)
    {
        this.logger = logger;
        this.accountService = accountService;
        this.cookiesUtility = cookiesUtility;
    }


    
    // Account Routes

    [HttpPost("create")]
    public async Task<IActionResult> CreateAccountPostAsync(NewUserRequest newUser)
    {
        var result = await accountService.CreateNewUserAsync(newUser);

        if (result.Successful && result.Data != null)
        {
            cookiesUtility.SetNewTokensInsideCookies(HttpContext, result.Data);

            logger.LogInformation("User with email {email} successfully logged in at {time}",
                newUser.Email, DateTime.UtcNow.ToString());

            return NoContent(); 
        }
        else
        {
            return result.Error.ErrorToActionResult();
        }
    }


    [HttpPost("login")]
    public async Task<IActionResult> LogInUserPostAsync(LogInUserRequest logInUser)
    {
        var result = await accountService.LogInUserAsync(logInUser); 

        if (result.Successful && result.Data != null)
        {
            cookiesUtility.SetNewTokensInsideCookies(HttpContext, result.Data);

            logger.LogInformation("User with email {email} successfully logged in at {time}", 
                logInUser.Email, DateTime.UtcNow.ToString());
            return NoContent();
        }
        else
        {
            return result.Error.ErrorToActionResult();
        }
    }


    [HttpPost("logout")]
    public async Task<IActionResult> LogoutUserPostAsync()
    {
        // get refresh token from httpcontext 
        var refreshTokenInBase64 = cookiesUtility.GetRefreshTokenFromHttpContext(HttpContext);

        if (refreshTokenInBase64 is null)
        {
            logger.LogWarning("Unable to find refresh token in cookies at user Logout");
            return NoContent();
        }

        await accountService.LogoutUserAsync(refreshTokenInBase64);
        cookiesUtility.InvalidateCookies(HttpContext);

        return NoContent(); 
    }

    [HttpPost("token/refresh")]
    public async Task<IActionResult> RefreshTokenPostAsync()
    {
        // get refresh token from httpcontext 
        var refreshTokenInBase64 = cookiesUtility.GetRefreshTokenFromHttpContext(HttpContext);

        if (refreshTokenInBase64 is null)
        {
            logger.LogWarning("Unable to find refresh token in cookies");
            Error error = new Error(ErrorType.BadRequest, "Refreh token not found", 
                "Unable to find refreh token form cookies");
            return error.ErrorToActionResult(); 
        }

        var tokenResult = await accountService.UpdateRefreshTokenAsync(refreshTokenInBase64);

        if (tokenResult.Successful && tokenResult.Data != null)
        {
            cookiesUtility.UpdateTokensInsideCookies(HttpContext, tokenResult.Data);
            return NoContent();
        }
        else
        {
            return tokenResult.Error.ErrorToActionResult();
        }
    }




    [HttpGet("/api/hello")]
    public IActionResult HelloGet()
    {
        return Ok(new { message = "Hello, from API" }); 
    }


    [Authorize]
    [HttpPatch("password")]
    public async Task<IActionResult> ChangeUserPassword(PasswordChangeRequest passwordChangeRequest)
    {
        int userId = User.GetUserId();

        var passwordChangedResult = await accountService.ChangeUserPassword(userId,
            passwordChangeRequest.OldPassword, passwordChangeRequest.NewPassword);

        if (passwordChangedResult.Successful)
        {
            cookiesUtility.InvalidateCookies(HttpContext);
            return NoContent(); 
        }
        else
        {
            return passwordChangedResult.Error.ErrorToActionResult();   
        }

    }


    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPasswordRequestAsync(ForgotPasswordRequest request)
    {
        var sendEmailResult = await accountService.SendResetPasswordEmailAsync(request.Email);

        if (sendEmailResult.Successful)
        {
            return NoContent(); 
        }
        else
        {
            return sendEmailResult.Error.ErrorToActionResult();
        }
    }


    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPasswordRequestAsync(ResetPasswordRequest request)
    {
        var resetPasswordResult = await accountService.ResetPasswordAsync(request); 

        if (resetPasswordResult.Successful)
        {
            cookiesUtility.InvalidateCookies(HttpContext);
            return NoContent();
        }
        else
        {
            return resetPasswordResult.Error.ErrorToActionResult();
        }
    }

}
