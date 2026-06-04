namespace API.DTOs.Card.Responses; 

public class CardMarkStateResponse
{
    public required int CardId { get; set; }
    public required bool IsDone { get; set; }
}
