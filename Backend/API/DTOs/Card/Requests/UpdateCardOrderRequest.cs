using API.DTOs.Card.Models;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Card.Requests; 

public class UpdateCardOrderRequest : IValidatableObject
{
    [Required]
    public required List<ListAndCardOrder> ListsAndCards { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // Empty check
        if (IsListEmpty())
        {
            yield return new ValidationResult("List is empty");
            yield break; // Stop further validation if nothing exists
        }

        // Duplicate List IDs
        if (HasDuplicateListIds())
        {
            yield return new ValidationResult(
                "Duplicate IDs are not allowed in List IDs",
                [nameof(ListsAndCards)]);
        }

        // Duplicate Card IDs inside any list
        if (HasDuplicateCardIds())
        {
            yield return new ValidationResult(
                "Duplicate IDs are not allowed in Card IDs",
                [nameof(ListsAndCards)]);
        }
    }

    private bool IsListEmpty()
    {
        return !ListsAndCards.Any();
    }

    private bool HasDuplicateListIds()
    {
        return ListsAndCards
            .Select(lc => lc.ListId)
            .Distinct()
            .Count() != ListsAndCards.Count;
    }

    private bool HasDuplicateCardIds()
    {
        int distinctCards = ListsAndCards.SelectMany(lc => lc.CardIDsInOrder).Distinct().Count();
        int allCards = ListsAndCards.SelectMany(lc => lc.CardIDsInOrder).Count();

        return distinctCards != allCards;
    }
}
