namespace API.DTOs.Board.Responses; 

public class BoardColourChangedResponse
{
    public required int BoardId { get; set; }
    public required int ChangedByUserId { get; set; }
    public required string NewBackgroundColour { get; set; }
}
