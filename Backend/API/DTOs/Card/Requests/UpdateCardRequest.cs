using DatabaseContext.Types;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Card.Requests; 

public class UpdateCardRequest : IValidatableObject
{
    [MinLength(1)]
    [StringLength(50)]
    public string? Title { get; set; }

    [StringLength(400)]
    public string? Description { get; set; }

    public bool? IsDone { get; set; }

    public DateOnly? DueDate { get; set; }

    public Priority? Priority { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Title is null && Description is null && IsDone is null && DueDate is null && Priority is null)
        {
            yield return new ValidationResult(
                "At least one field must be provided",
                [nameof(Title), nameof(Description), nameof(IsDone), nameof(DueDate) , nameof(Priority)]
                ); 
        }
    }
}
