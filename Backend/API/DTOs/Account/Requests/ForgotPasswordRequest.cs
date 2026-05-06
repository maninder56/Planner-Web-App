using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Account.Requests; 

public class ForgotPasswordRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
}
