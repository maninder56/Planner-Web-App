namespace API.DTOs.Card.Responses; 

public class CardUnLockedByAnohterUserResponse
{
    public required int BoardId { get; set; }
    public required int ByUserId { get; set; }
    public required int CardId { get; set; }
}
