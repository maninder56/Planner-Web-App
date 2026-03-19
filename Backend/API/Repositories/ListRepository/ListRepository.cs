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



    public async Task UpdateBoardListOrderAsync(int boardId, List<int> listIdsInOrder)
    {
        var boardLists = await database.BoardLists
            .Where(bl => bl.BoardId == boardId && listIdsInOrder.Contains(bl.BoardListId))
            .ToListAsync();

        if (listIdsInOrder.Count != boardLists.Count)
        {
            throw new BadRequestException("Invalid list IDs"); 
        }

        var positionMap = listIdsInOrder
            .Select((id, index) => new { id, index })
            .ToDictionary(x => x.id, x => x.index); 

        foreach (var boardList in boardLists)
        {
            if (positionMap.TryGetValue(boardList.BoardListId, out var position))
            {
                boardList.ListPosition = position;
            }
        }

        await database.SaveChangesAsync();
    }


    // Delete operations 

    public async Task DeleteListAsync(int boardId, int listId)
    {
        await database.BoardLists
            .Where(bl => bl.BoardId == boardId && bl.BoardListId == listId)
            .ExecuteDeleteAsync();
    }
}
