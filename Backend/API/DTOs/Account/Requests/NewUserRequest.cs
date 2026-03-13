using API.Validations;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Account.Requests; 

public class NewUserRequest
{
    [Required]
    [StringLength(100)]
    public required string Name { get; set; }

    [EmailAddress]
    [StringLength (200)]
    public required string Email { get; set; }

    [Required]
    [StringLength (100, MinimumLength = 8)]
    [PasswordValidation]
    public required string Password { get; set; }    
}
