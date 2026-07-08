using API.Models.BoardList;

namespace API.Models.Board; 

public class GuestBoard
{
    public required string BoardName { get; set; }
    public required string BoardBackgroundColour { get; set; }

    public List<GuestList> GuestLists { get; set; } = []; 
}
