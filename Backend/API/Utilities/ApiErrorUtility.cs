using API.Models.Result;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace API.Utilities; 

public static class ApiErrorUtility
{
    public static IActionResult ErrorToActionResult(this ErrorType error, ProblemDetails problemDetails)
    {
        return error switch
        {
            ErrorType.BadRequest => new BadRequestObjectResult(problemDetails), 
            ErrorType.Unauthorized => new UnauthorizedObjectResult(problemDetails),
            ErrorType.NotFound => new NotFoundObjectResult(problemDetails), 
            ErrorType.InternalServerError or _ => new ObjectResult(new ProblemDetails
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
