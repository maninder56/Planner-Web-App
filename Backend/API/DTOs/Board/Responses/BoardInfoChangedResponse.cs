namespace API.DTOs.Board.Responses; 

public class BoardInfoChangedResponse
{
    public required int BoardId { get; set; }
    public required int ByUserId { get; set; }
    public string? NewBackgroundColour { get; set; }
    public string? NewBoardName { get; set; } 
}
