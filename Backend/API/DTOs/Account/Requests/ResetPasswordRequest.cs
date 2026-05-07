using API.Validations;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Account.Requests; 

public class ResetPasswordRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string token { get; set; }

    [Required]
    [PasswordValidation]
    public required string NewPassword { get; set; }
}
