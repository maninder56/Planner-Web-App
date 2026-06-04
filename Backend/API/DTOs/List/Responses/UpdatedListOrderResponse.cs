namespace API.DTOs.List.Responses; 

public class UpdatedListOrderResponse
{
    public required int ByUserId { get; set; }
    public required int BoardId { get; set; }

    public required List<int> ListOrder { get; set; }
}
