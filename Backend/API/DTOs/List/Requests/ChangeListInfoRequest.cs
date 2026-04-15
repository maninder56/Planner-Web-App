using System.ComponentModel.DataAnnotations;

namespace API.DTOs.List.Requests; 

public class ChangeListInfoRequest : IValidatableObject
{
    [StringLength(30)]
    [MinLength(1)]
    public string? Name { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Name is null)
        {
            yield return new ValidationResult("At least one field must be provided", [nameof(Name)]); 
            yield break;
        }

        string name = Name.Trim(); 

        if (string.IsNullOrEmpty(name))
        {
            yield return new ValidationResult("Must provide at least one character", [nameof(Name)]); 
        }
    }

    //[Range(0, int.MaxValue, ErrorMessage = "Position must be greater than -1")]
    //public int? ListPosition { get; set; }


}
