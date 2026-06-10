namespace API.Models.Card; 

public class CardLockInfo
{
    public required int CardId { get; set; }
    public required int BoardId { get; set; }
    public required int UserId { get; set; }
    public DateTime LockedAt { get; set; }
}
