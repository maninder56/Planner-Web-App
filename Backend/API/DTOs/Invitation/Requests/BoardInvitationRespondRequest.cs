using DatabaseContext.Types;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Invitation.Requests; 

public class BoardInvitationRespondRequest : IValidatableObject
{
    [Required]
    public required InvitationStatus Status { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // User can only accept or reject the invitation
        if (Status != InvitationStatus.Accepted &&  Status != InvitationStatus.Rejected)
        {
            yield return new ValidationResult(
                "Invitation can only be accepted or rejected",
                [nameof(Status)]); 
        }
    }
}
