namespace API.DTOs.List.Responses;

public class NewListResponse
{
    public required int Id { get; set; }

    public required string Name { get; set; }

    public int ListPosition { get; set; }
}
