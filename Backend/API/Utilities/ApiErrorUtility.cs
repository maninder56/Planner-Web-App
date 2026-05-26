using API.Models.Result;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace API.Utilities; 

public static class ApiErrorUtility
{
    public static IActionResult ErrorToActionResult(this Error error)
    {
        var problemDetails = new ProblemDetails()
        { 
            Title = error.Title, 
            Detail = error.Description 
        }; 

        return error.Type switch
        {
            ErrorType.BadRequest => new BadRequestObjectResult(problemDetails), 
            ErrorType.Unauthorized => new UnauthorizedObjectResult(problemDetails),
            ErrorType.NotFound => new NotFoundObjectResult(problemDetails), 
            ErrorType.Conflict => new ConflictObjectResult(problemDetails),
            ErrorType.TooManyRequests => new ObjectResult(new ProblemDetails
            {
                Status = StatusCodes.Status429TooManyRequests,
                Title = error.Title,
                Detail = error.Description
            })
            {
                StatusCode = StatusCodes.Status429TooManyRequests
            }, 
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
