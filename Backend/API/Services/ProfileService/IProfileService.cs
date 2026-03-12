using API.DTOs.Profile.Responses;
using API.Models.Result;

namespace API.Services.ProfileService; 

public interface IProfileService
{
    public Task<Result<ProfileInfoResponse>> GetUserProfileInfoAsync(int userId); 
}
