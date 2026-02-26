using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Account; 

public class LogInUserDTO
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string Password { get; set; }
}
