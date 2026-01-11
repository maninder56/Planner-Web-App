using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Account; 

public class LogInUserDTO
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
}
