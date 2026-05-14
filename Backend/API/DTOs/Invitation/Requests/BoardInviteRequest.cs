using DatabaseContext.Types;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Invitation.Requests; 

public class BoardInviteRequest : IValidatableObject
{
    [Required]
    [Range(0, int.MaxValue)]
    public required int BoardId { get; set; }

    [Required]
    [EmailAddress]
    public required string InvitedUserEmail { get; set; }

    [Required]
    public required Role Role { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // Owner role is not allowed
        if (Role == Role.Owner)
        {
            yield return new ValidationResult(
                "Each board can only have one owner",
                [nameof(Role)]); 
        }
    }
}
