namespace API.DTOs.User.Responses;

public class UserJoiningInfoResponse
{
    public required int UserId { get; set; }
    
    //public required int BoardId { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }
}
