using API.DTOs.Card.Models;

namespace API.DTOs.Card.Responses; 

public class UpdatedCardOrderResponse
{
    public required int BoardId { get; set; }
    public required int ByUserId { get; set; }

    public required ListAndCardOrder firstList {  get; set; }

    // if cards were moved within two lists
    public ListAndCardOrder? secondList { get; set; }
}
