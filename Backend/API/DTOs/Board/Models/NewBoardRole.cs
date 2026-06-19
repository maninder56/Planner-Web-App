using DatabaseContext.Types;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Board.Models; 

public class NewBoardRole : IValidatableObject
{
    [Range(1, int.MaxValue)]
    public required int userId { get; set; }

    public required Role NewRole { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (NewRole == Role.Owner)
        {
            yield return new ValidationResult(
                "New role can not be set to Owner",
                [nameof(NewRole)]); 
        }
    }
}
