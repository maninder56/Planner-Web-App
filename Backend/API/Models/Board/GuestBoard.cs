using API.Models.BoardList;

namespace API.Models.Board; 

public class GuestBoard
{
    public string BoardName { get; set; }
    public string BoardBackgroundColour { get; set; }

    public List<GuestList> GuestLists { get; set; } = []; 
}
