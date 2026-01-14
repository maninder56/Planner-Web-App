using API.Models.Result;
using Microsoft.AspNetCore.Mvc;

namespace API.Utilities; 

public static class ApiErrorUtility
{
    public static IActionResult ErrorToActionResult(this Error error)
    {
        switch(error)
        {
            case Error.BadRequest:
                return new BadRequestObjectResult("Bad Request"); 

            case Error.Unauthorized:
                return new UnauthorizedObjectResult("Unauthorized");

            case Error.NotFound:
                return new NotFoundObjectResult("Not Found");

            case Error.InternalServerError:
            default:
                return new ObjectResult(new ProblemDetails
                    {
                        Status = StatusCodes.Status500InternalServerError,
                        Title = "Internal Server Error",
                        Detail = "An unexpected error occured"
                    })
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                }; 
        }
    }
}
