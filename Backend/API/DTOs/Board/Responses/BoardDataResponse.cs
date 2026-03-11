using DatabaseContext.Types;
using System.Text.Json.Serialization;

namespace API.DTOs.Board.Responses; 

public class BoardDataResponse
{
  
    public required int BoardId { get; init; } 

    public required string Name { get; init; }

    public required bool IsFavoriteBoard { get; init; }

    public required string BackgroundColour { get; init; }

    public required Role Role { get; init; }

    public List<BoardListResponse> BoardList { get; set; } = new List<BoardListResponse>();
}
