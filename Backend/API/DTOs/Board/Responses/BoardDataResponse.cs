namespace API.DTOs.Board.Responses; 

public class BoardDataResponse
{
  
    public int BoardId { get; init; } 

    public required string Name { get; init; }

    public bool IsFavoriteBoard { get; init; }

    public required string BackgroundColour { get; init; }

    public List<BoardListResponse> BoardList { get; set; } = new List<BoardListResponse>();
}
