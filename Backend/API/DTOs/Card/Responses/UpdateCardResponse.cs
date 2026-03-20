using DatabaseContext.Types;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Card.Responses; 

public class UpdateCardResponse
{
    public required int CardId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public bool? IsDone { get; set; }

    public DateOnly? DueDate { get; set; }

    public Priority? Priority { get; set; }
}
