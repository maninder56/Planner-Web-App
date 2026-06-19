using API.DTOs.Board.Models;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Board.Requests; 

public class UpdateBoardMembershipRequest : IValidatableObject
{
    public List<NewBoardRole> Roles { get; set; } = new List<NewBoardRole>();

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Roles.Count == 0)
        {
            yield return new ValidationResult(
                "No new roles provided", [nameof(Roles)]); 
        }

        if (!IsUserIdUnique())
        {
            yield return new ValidationResult(
                "No Duplicate user Ids allowed", [nameof(Roles)]); 
        }
        
    }

    private bool IsUserIdUnique()
    {
        return Roles.Select(r => r.userId).Distinct().Count() == Roles.Count; 
    }
}
