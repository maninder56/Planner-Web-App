namespace API.DTOs.Board; 

public class BoardDataDTO
{
  
    public int BoardId { get; init; } 

    public required string Name { get; init; }

    public bool IsFavoriteBoard { get; init; }

    public required string BackgroundColour { get; init; }

    public List<BoardListDTO> BoardList { get; set; } = new List<BoardListDTO>();
}
