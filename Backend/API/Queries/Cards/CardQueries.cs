using API.DTOs.Board.Responses;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Queries.Cards; 

public class CardQueries(PlannerContext database)
{
    public async Task<SearchResponse> SearchCardsByKeyword(int userId, string keyword)
    {
        var resultItems = await database.Cards.AsNoTracking()
            .Where(c => EF.Functions.Like(c.Title, $"%{keyword}%") &&
                c.BoardList.Board.BoardMembers.Any(bm => bm.UserId == userId))
            .OrderByDescending(c => c.Title == keyword)
            .ThenBy(c => c.Title.StartsWith(keyword))
            .ThenBy(c => c.Title)
            .Take(10)
            .Select(c => new SearchResultItem
            {
                BoardId = c.BoardList.BoardId,
                CardId = c.CardId,
                CardName = c.Title, 
                BoardName = c.BoardList.Board.Name,
<<<<<<< Updated upstream
                ListName = c.BoardList.Name,
                ListId = c.BoardList.BoardListId,
=======
>>>>>>> Stashed changes
            }).ToListAsync();

        SearchResponse response = new SearchResponse()
        {
            searchResults = resultItems,
        };

        return response;
    }
}
