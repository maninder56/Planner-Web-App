using API.Models.Card;

namespace API.Models.BoardList; 

public class GuestList
{
    public required string Name { get; set; }

    public List<GuestCard> Cards { get; set; } = new List<GuestCard>();
}
