using DatabaseContext.Types;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Card.Responses; 

public class CardInfoResponse
{
    public int CardId { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }

    public int CardPosition { get; set; }

    public bool IsDone { get; set; }

    public DateOnly DueDate { get; set; }

    public Priority Priority { get; set; }

    public int BoardListId { get; set; }
}
