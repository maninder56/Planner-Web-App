using API.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace API.Handler;

public sealed class GlobalExceptionHandler(
    ILogger<GlobalExceptionHandler> logger,
    IProblemDetailsService problemDetailsService, 
    ProblemDetailsFactory problemDetailsFactory) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        logger.LogError(exception, "Unhandled exception occured. TraceId: {TraceId}", httpContext.TraceIdentifier); 

        var (statusCode, title) = MapException(exception);

        httpContext.Response.StatusCode = statusCode;

        ProblemDetails problemDetails = problemDetailsFactory
            .CreateProblemDetails(httpContext, statusCode, title);

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problemDetails,
        }); 
    }

    private static (int StatusCode, string Title) MapException(Exception exception)
    {
        return exception switch
        {
            AppException appEx => ((int)appEx.StatusCode, appEx.Message),
            ArgumentNullException => (StatusCodes.Status400BadRequest, "Invalid argument provided"), 
            ArgumentException => (StatusCodes.Status400BadRequest, "Invalid argumnet provided"), 
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized"), 
            _ => (StatusCodes.Status500InternalServerError, "An Unexpected error occured")
        }; 
    }

}
