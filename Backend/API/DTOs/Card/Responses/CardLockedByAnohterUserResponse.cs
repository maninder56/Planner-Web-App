namespace API.DTOs.Card.Responses; 

public class CardLockedByAnohterUserResponse
{
    public required int BoardId { get; set; }
    public required int ByUserId { get; set; }
    public required int CardId { get; set; }
    public required DateTime LockedAt { get; set; }
}
