using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Account.Requests; 

public class PasswordChangeRequest
{
    [Required]
    [StringLength(100)]
    public required string OldPassword { get; set; }


    [Required]
    [StringLength(100)]
    public required string NewPassword { get; set; }
}
