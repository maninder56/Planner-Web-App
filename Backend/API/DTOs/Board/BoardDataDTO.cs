namespace API.DTOs.Board; 

public class BoardDataDTO
{
    /* 
     id: z.number(), 
    title: z.string(),
    isFavoriteBoard: z.boolean(), 
    boardColour: BoardColour,
    boardLists: z.array(BoardList),
     */

    public string BoardId { get; init; } 

    public string Name { get; init; }

    public string IsFavoriteBoard { get; init; }

    public string BackgroundColour { get; init; }

    public List<BoardDataDTO> BoardList { get; init; }
}
