
namespace API.DTOs.User.Responses; 

public class UserInfo
{
    public int UserId { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }
}
