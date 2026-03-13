using API.DTOs.Profile.Responses;
using API.Exceptions;
using API.Models.Result;
using API.Queries.Profile;
using API.Repositories.Profile;
using Pomelo.EntityFrameworkCore.MySql.Storage.Internal.Json;

namespace API.Services.ProfileService; 

public class ProfileService (
    ILogger<ProfileService> logger, 
    ProfileQueries profileQueries, 
    IProfileRepository profileRepository) 
    : IProfileService
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


    public async Task<Result> UpdateUserNameAsync(int userId, string newName)
    {
        try
        {
            await profileRepository.UpdateUserNameAsync(userId, newName);
            return Result.Success(); 
        }
        catch (NotFoundException ex)
        {
            return Result.Failed(ErrorType.NotFound, ex.Message);   
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to update user name, exception message: {ExceptionMessage}", ex.Message);
            return Result.Failed(ErrorType.InternalServerError, "Unexpected error"); 
        }
    }


    public async Task<Result> DeleteProfileAsync(int userId)
    {
        try
        {
            await profileRepository.DeleteProfileAsync(userId);
            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to delete user profile, exception message: {ExceptionMessage}", ex.Message);
            return Result.Failed(ErrorType.InternalServerError, "Unexpected error");
        }
    }
}
