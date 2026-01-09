namespace API.DTOs.Account; 

public class NewUserDTO
{
    public required string Name { get; set; }

    public required string Email { get; set; }

    public required string Password { get; set; }    
}
