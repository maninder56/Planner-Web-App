using DatabaseContext.Types;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Card.Responses; 

public class CardUpdatedResponse
{
    public required int ByUserId { get; set; }
    public required int ListId { get; set; }
    public required int CardId { get; set; }
    public required int BoardId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public bool? IsDone { get; set; }

    public DateOnly? DueDate { get; set; }

    public Priority? Priority { get; set; }
}
