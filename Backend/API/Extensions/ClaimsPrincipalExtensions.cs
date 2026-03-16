using API.Exceptions;
using System.Security.Claims;

namespace API.Extensions; 

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var stringUserId = user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new NotFoundException("User not found"); 

        if (int.TryParse(stringUserId, out int UserId))
        {
            return UserId;
        }
        else
        {
            throw new BadRequestException("Invalid User Credentials"); 
        }
    }
}
