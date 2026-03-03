namespace API.DTOs.Board; 

public class BoardListDTO
{

    public int BoardListId { get; init; }

    public required string Name { get; init; }

    public int ListPosition { get; init; }

    public List<BoardCardDTO> CardList { get; init; } = new List<BoardCardDTO>();
}
