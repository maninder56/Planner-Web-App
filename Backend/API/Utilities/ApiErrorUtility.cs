using API.Models.Result;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace API.Utilities; 

public static class ApiErrorUtility
{
    public static IActionResult ErrorToActionResult(this Error error, ProblemDetails problemDetails)
    {
        return error switch
        {
            Error.BadRequest => new BadRequestObjectResult(problemDetails), 
            Error.Unauthorized => new UnauthorizedObjectResult(problemDetails),
            Error.NotFound => new NotFoundObjectResult(problemDetails), 
            Error.InternalServerError or _ => new ObjectResult(new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Internal Server Error",
                    Detail = "An unexpected error occured"
                })
            {
                StatusCode = StatusCodes.Status500InternalServerError
            }
        }; 
    }
}
