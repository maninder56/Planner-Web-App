namespace API.DTOs.Board.Responses; 

public class BoardDeletedResponse
{
    public required int ByUserId { get; set; }
    public required int BoardId { get; set; }
}
