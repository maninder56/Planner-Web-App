using API.DTOs.Board;
using API.Models.Result;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Queries.Boards; 

public class BoardQueries(PlannerContext database)
{
    public async Task<BoardDataDTO?> GetBoardData(int userId,  int boardId)
    {
        var isFavoriteBoard = database.BoardStars
            .Any(bs => bs.BoardId == boardId && bs.UserId == userId);

        var query = await database.Boards.AsNoTracking()
            .Where(b => b.BoardId == boardId)
            .Select(b => new BoardDataDTO
            {
                BoardId = b.BoardId,
                Name = b.Name,
                IsFavoriteBoard = isFavoriteBoard,
                BackgroundColour = b.BackgroundColour

            }).SingleOrDefaultAsync();

        return query; 
    }

    public async Task<List<BoardListDTO>> GetBoardListDataAndCardsData(int boardId)
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

    public async Task<BoardDataDTO?> GetBoardIdOfLastUsedBoard(int userId)
    {
        var lastBoardId = await database.Users.AsNoTracking()
            .Where(u => u.UserId == userId)
            .Select(u => u.LastBoardId)
            .SingleOrDefaultAsync();

        if (lastBoardId is null)
        {
            return null;
        }

        var query = await database.BoardMembers.AsNoTracking()
            .WhereUserHasAccess(userId, (int)lastBoardId)
            .Select(bm => new BoardDataDTO
            {
                BoardId = bm.BoardId,
                Name = bm.Board.Name,
                BackgroundColour = bm.Board.BackgroundColour,
                IsFavoriteBoard = database.BoardStars
                    .Any(bs => bs.BoardId == bm.BoardId && bm.UserId == userId),
            }).SingleOrDefaultAsync(); 

        return query;
            
    }
}
