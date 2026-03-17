using API.DTOs.List.Requests;
using API.Exceptions;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.ListRepository; 

public class ListRepository (PlannerContext database) : IListRepository
{
    // Create operations 
    public async Task<BoardList> CreateNewBoardListAsync(int boardId, string listName)
    {
        var lastPosition = await database.BoardLists
            .Where(bl => bl.BoardId == boardId)
            .MaxAsync(bl => (int?)bl.ListPosition);

        BoardList boardList = new BoardList()
        {
            Name = listName,
            BoardId = boardId,
            ListPosition = (lastPosition ?? -1) + 1, 
        };

        database.BoardLists.Add(boardList);

        await database.SaveChangesAsync();  

        return boardList;
    }


    // Update operations 
    public async Task<BoardList> UpdateBoardListAsync(int boardId, int listId, ChangeListInfoRequest request)
    {
        BoardList boardList = await database.BoardLists
            .Where(bl => bl.BoardId == boardId && bl.BoardListId == listId)
            .SingleOrDefaultAsync()
            ?? throw new NotFoundException("Resource not found"); 

        if (request.Name is not null)
        {
            boardList.Name = request.Name;
        }

        await database.SaveChangesAsync();

        return boardList;
    }
}
