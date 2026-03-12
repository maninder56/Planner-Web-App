using API.DTOs.Board.Responses;
using API.Models.Result;
using API.Queries.Boards;
using API.Queries.Cards;

namespace API.Services.CardService; 

public class CardService(ILogger<CardService> logger, CardQueries cardQueries) : ICardService
{
    public async Task<Result<SearchResponse>> SearchCardByKeyword(int userId, string keyword)
    {
        SearchResponse searchResponse = await cardQueries.SearchCardsByKeyword(userId, keyword);

        if (searchResponse.searchResults.Count == 0)
        {
            return Result<SearchResponse>.Failed(ErrorType.NotFound, "Unable to find keyword");
        }
        else
        {
            return Result<SearchResponse>.Success(searchResponse);
        }
    }
}
