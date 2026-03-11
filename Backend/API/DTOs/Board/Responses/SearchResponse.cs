namespace API.DTOs.Board.Responses; 

public class SearchResponse
{
    public List<SearchResultItem> searchResults { get; set; } = new List<SearchResultItem>();
}
