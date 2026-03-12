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
            }).SingleOrDefaultAsync();

        return query; 
    }

    public async Task<List<BoardListResponse>> GetBoardListDataAndCardsDataAsync(int boardId)
    {
        var query = await database.BoardLists.AsNoTracking()
            .Where(bl => bl.BoardId == boardId)
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

    public async Task<SearchResponse> SearchCardsByKeyword(int userId, string keyword)
    {
        var resultItems = await database.Cards.AsNoTracking()
            .Where(c => c.Title.Contains(keyword) && 
                c.BoardList.Board.BoardMembers.Any(bm => bm.UserId == userId))
            .Select(c => new SearchResultItem
            { 
                BoardId = c.BoardList.BoardId, 
                CardId = c.CardId, 
                CardName = c.Title
            }).ToListAsync(); 

        SearchResponse response = new SearchResponse()
        {
            searchResults = resultItems,
        }; 

        return response;
    }
}
