using API.DTOs.Board.Responses;
using API.Models.Result;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Queries.Boards; 

public class BoardQueries(PlannerContext database)
{
    public async Task<BoardDataResponse?> GetBoardDataAsync(int userId,  int boardId)
    {
        var query = await database.BoardMembers.AsNoTracking()
            .WhereUserHasAccess(userId, boardId)
            .Select(bm => new BoardDataResponse
            {
                BoardId = bm.Board.BoardId,
                Name = bm.Board.Name,
                BackgroundColour = bm.Board.BackgroundColour,
                Role = bm.Role,
                IsFavoriteBoard = database.BoardStars
                    .Any(bs => bs.BoardId == boardId && bs.UserId == userId), 
                BoardList = bm.Board.Lists
                    .OrderBy(bl => bl.ListPosition)
                    .Select(bl => new BoardListResponse
                    {
                        BoardListId = bl.BoardListId,
                        Name = bl.Name,
                        ListPosition = bl.ListPosition,
                        CardList = bl.Cards
                            .OrderBy(c => c.CardPosition)
                            .Select(c => new BoardCardResponse
                            {
                                CardId = c.CardId,
                                Title = c.Title,
                                Description = c.Description,
                                IsDone = c.IsDone,
                                Priority = c.Priority.ToString(),
                                DueDate = c.DueDate,
                                CardPosition = c.CardPosition,
                            }).ToList(),
                    }).ToList(),
            }).SingleOrDefaultAsync();

        return query; 
    }

    public async Task<List<BoardListResponse>> GetBoardListDataAndCardsDataAsync(int userId, int boardId)
    {
        var query = await database.BoardLists.AsNoTracking()
            .Where(bl => bl.BoardId == boardId && 
                bl.Board.BoardMembers.Any(bm => bm.UserId == userId && bm.BoardId == boardId))
            .OrderBy(bl => bl.ListPosition)
            .Select(bl => new BoardListResponse
            {
                BoardListId = bl.BoardListId,
                Name = bl.Name,
                ListPosition = bl.ListPosition,
                CardList = bl.Cards
                    .Where(c => c.BoardListId == bl.BoardListId)
                    .OrderBy(c => c.CardPosition)
                    .Select(c => new BoardCardResponse
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


    public async Task<List<BoardDataResponse>> GetAllBoardsOfUserAsync(int userId)
    {
        var query = await database.BoardMembers.AsNoTracking()
            .Where(bm => bm.UserId == userId)
            .Select(bm => new BoardDataResponse
            {
                BoardId = bm.BoardId,
                Name = bm.Board.Name,
                BackgroundColour = bm.Board.BackgroundColour,
                Role = bm.Role, 
                IsFavoriteBoard = database.BoardStars
                    .Any(bs => bs.BoardId == bm.BoardId && bs.UserId == userId),
            }).ToListAsync(); 
            
        return query;
    }


}
