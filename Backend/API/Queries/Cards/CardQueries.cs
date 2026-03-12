using API.DTOs.Board.Responses;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Queries.Cards; 

public class CardQueries(PlannerContext database)
{
    public async Task<SearchResponse> SearchCardsByKeyword(int userId, string keyword)
    {
        var resultItems = await database.Cards.AsNoTracking()
            .Where(c => c.Title.ToLower().Contains(keyword.ToLower()) &&
                c.BoardList.Board.BoardMembers.Any(bm => bm.UserId == userId))
            .OrderBy(c => c.Title)
            .Take(10)
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
