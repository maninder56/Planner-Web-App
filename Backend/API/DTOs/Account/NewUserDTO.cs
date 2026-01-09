using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Account; 

public class NewUserDTO
{
    [Required]
    public required string Name { get; set; }

    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string Password { get; set; }    
}
