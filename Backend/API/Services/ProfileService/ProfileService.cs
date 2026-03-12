using API.DTOs.Profile.Responses;
using API.Models.Result;
using API.Queries;

namespace API.Services.ProfileService; 

public class ProfileService (ILogger<ProfileService> logger, ProfileQueries profileQueries) : IProfileService
{
    public async Task<Result<ProfileInfoResponse>> GetUserProfileInfoAsync(int userId)
    {
        var userProfile = await profileQueries.GetUserProfileInfoAsync(userId);

        if (userProfile is null)
        {
            logger.LogWarning("Failed to get user profile of user with Id: {ID}", userId);
            return Result<ProfileInfoResponse>.Failed(ErrorType.NotFound, "User profile not found"); 
        }
        else
        {
            return Result<ProfileInfoResponse>.Success(userProfile);
        }
    }
}
