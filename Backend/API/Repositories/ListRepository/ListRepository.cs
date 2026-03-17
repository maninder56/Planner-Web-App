using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.ListRepository; 

public class ListRepository (PlannerContext database) : IListRepository
{
    // Create operations 
    public async Task<BoardList> CreateNewBoardListAsync(int boardId, string listName)
    {
        var boardLists = await database.BoardLists
            .Where(bl => bl.BoardId == boardId)
            .OrderBy(bl => bl.ListPosition)
            .ToListAsync();

        BoardList boardList = new BoardList()
        {
            Name = listName,
            ListPosition = 0, 
        };

        if (boardLists.Count > 0 )
        {
            boardList.ListPosition = boardLists.Last().ListPosition + 1; 
        }

        boardLists.Add(boardList);

        await database.SaveChangesAsync();  

        return boardList;
    }
}
