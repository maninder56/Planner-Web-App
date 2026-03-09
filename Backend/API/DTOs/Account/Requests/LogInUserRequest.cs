using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Account.Requests; 

public class LogInUserRequest
{
    [Required]
    [EmailAddress]
    [StringLength(200)]
    public required string Email { get; set; }

    [Required]
    [StringLength(100)]
    public required string Password { get; set; }
}
