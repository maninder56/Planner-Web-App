namespace API.DTOs.Board; 

public class BoardListDTO
{
    //id: z.number(),
    //title: z.string (), 
    //position: z.number(), 
    //cardList: z.array(Card),

    public string BoardListId { get; init; }

    public string Name { get; init; }

    public string ListPosition { get; init; }

    public List<BoardCardDTO> CardList { get; init; }
}
