namespace API.DTOs.Board.Responses; 

public class BoardListResponse
{

    public int BoardListId { get; init; }

    public required string Name { get; init; }

    public int ListPosition { get; init; }

    public List<BoardCardResponse>? CardList { get; init; }
}
