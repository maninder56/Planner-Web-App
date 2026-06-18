using DatabaseContext.Types;

namespace API.DTOs.Card.Responses; 

public class NewCardAddedResponse
{
    public required int ByUserId { get; set; }

    public required int BoardId { get; set; }

    public int CardId { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }

    public int CardPosition { get; set; }

    public bool IsDone { get; set; }

    public DateOnly DueDate { get; set; }

    public Priority Priority { get; set; }

    public int BoardListId { get; set; }
}
