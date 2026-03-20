using API.DTOs.Profile.Responses;
using API.Models.Result;

namespace API.Services.ProfileService; 

public interface IProfileService
{
    public Task<Result<ProfileInfoResponse>> GetUserProfileInfoAsync(int userId);

    public Task<Result> UpdateUserNameAsync(int userId, string name);


    public Task<Result> DeleteProfileAsync(int userId); 
}
