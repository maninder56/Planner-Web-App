using System.ComponentModel.DataAnnotations;

namespace API.DTOs.List.Requests; 

public class ChangeListOrderRequest : IValidatableObject
{
    [Required]
    public required List<int> ListIdsInOrder { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (IsListEmpty())
        {
            yield return new ValidationResult("List is empty"); 
            yield break;
        }

        if (HasDuplicateListIDs())
        {
            yield return new ValidationResult("Duplicate IDs are not allowed in List",
                [nameof(ListIdsInOrder)]); 
        }
    }

    private bool IsListEmpty()
    {
        return !ListIdsInOrder.Any(); 
    }

    private bool HasDuplicateListIDs()
    {
        return ListIdsInOrder.Distinct()
            .Count() != ListIdsInOrder.Count; 
    }
}


