namespace API.DTOs.Card.Responses; 

public class CardLockResponse
{
    public bool Success { get; set; }

    public CardLockResponse(bool success)
    {
        this.Success = success;
    }
}
