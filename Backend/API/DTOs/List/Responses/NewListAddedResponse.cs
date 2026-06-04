namespace API.DTOs.List.Responses; 

public class NewListAddedResponse
{
    public required int ByUserId { get; set; }

    public required int ListId { get; set; }

    public required string Name { get; set; }

    public int ListPosition { get; set; }
}
