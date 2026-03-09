using API.DTOs.Board;
using API.Models.Result;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Queries.Boards; 

public class BoardQueries(PlannerContext database)
{
    public async Task<BoardDataDTO?> GetBoardDataAsync(int userId,  int boardId)
    {
        var query = await database.BoardMembers.AsNoTracking()
            .WhereUserHasAccess(userId, boardId)
            .Select(bm => new BoardDataDTO
            {
                BoardId = bm.Board.BoardId,
                Name = bm.Board.Name,
                BackgroundColour = bm.Board.BackgroundColour,
                IsFavoriteBoard = database.BoardStars
                    .Any(bs => bs.BoardId == boardId && bs.UserId == userId),
            }).SingleOrDefaultAsync();

        return query; 
    }

    public async Task<List<BoardListDTO>> GetBoardListDataAndCardsDataAsync(int boardId)
    {
        var query = await database.BoardLists.AsNoTracking()
            .Where(bl => bl.BoardId == boardId)
            .Select(bl => new BoardListDTO
            {
                BoardListId = bl.BoardListId,
                Name = bl.Name,
                ListPosition = bl.ListPosition,
                CardList = bl.Cards
                    .Where(c => c.BoardListId == bl.BoardListId)
                    .Select(c => new BoardCardDTO
                    {
                        CardId = c.CardId,
                        Title = c.Title,
                        Description = c.Description,
                        IsDone = c.IsDone,
                        Priority = c.Priority.ToString(),
                        DueDate = c.DueDate,
                        CardPosition = c.CardPosition,
                    }).ToList(),
            }).ToListAsync();

        return query; 
    }

    public async Task<int?> GetBoardIdOfLastUsedBoardAsync(int userId)
    {
        var query = await database.Users.AsNoTracking()
            .Where(u => u.UserId == userId)
            .Select(u => u.LastBoardId)
            .SingleOrDefaultAsync();

        return query;
    }
}
