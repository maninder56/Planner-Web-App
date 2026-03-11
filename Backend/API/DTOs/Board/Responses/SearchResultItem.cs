namespace API.DTOs.Board.Responses; 

public class SearchResultItem
{
    public int BoardId { get; set; }

    public int CardId { get; set; }

    public required string CardName { get; set; }
}
