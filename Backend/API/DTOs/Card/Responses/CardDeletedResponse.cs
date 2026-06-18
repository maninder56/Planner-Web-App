namespace API.DTOs.Card.Responses; 

public class CardDeletedResponse
{
    public required int ByUserId { get; set; }
    public required int ListId { get; set; }
    public required int CardId { get; set; }
    public required int BoardId { get; set; }
}
