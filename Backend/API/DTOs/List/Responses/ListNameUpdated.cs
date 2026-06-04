namespace API.DTOs.List.Responses; 

public class ListNameUpdated
{
    public required int ByUserId { get; set; }

    public required string NewName { get; set; }

}
