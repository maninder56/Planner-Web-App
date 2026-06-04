namespace API.DTOs.List.Responses; 

public class ListDeletedResponse
{
    public required int ByUserId { get; set; }
    public required int ListId { get; set; }
    public required int BoardId { get; set; }
}
