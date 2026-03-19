using API.Validations;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Board.Requests; 

public class BoardInfoChangeRequest : IValidatableObject
{
    [MinLength(1)]
    [StringLength(100)]
    public string? Name { get; set; }

    public bool? IsFavoriteBoard { get; set; }

    [StringLength(30)]
    [ColourValidation(AllowNull = true)]
    public string? BackgroundColour { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Name is null && IsFavoriteBoard is null && BackgroundColour is null)
        {
            yield return new ValidationResult(
                "At least one field must be provided",
                [nameof(Name), nameof(IsFavoriteBoard), nameof(BackgroundColour)]); 
        }
    }
}
