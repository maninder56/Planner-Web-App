using API.DTOs.Board.Responses;
using API.DTOs.Card.Requests;
using API.DTOs.Card.Responses;
using API.Exceptions;
using API.Models.Result;
using API.Queries.Boards;
using API.Queries.Cards;
using API.Repositories.CardRepository;
using DatabaseContext;

namespace API.Services.CardService; 

public class CardService(ILogger<CardService> logger, CardQueries cardQueries, ICardRepository cardRepository) : ICardService
{
    // Read operations

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


    // Create operations 

    public async Task<Result<CardInfoResponse>> CreateNewCardAsync(int boardId, int listId, NewCardRequest request)
    {
        try
        {
            Card cardCreated = await cardRepository.CreateNewCardAsync(boardId, listId, request);

            return Result<CardInfoResponse>.Success(new CardInfoResponse
            {
                CardId = cardCreated.CardId, 
                Title = cardCreated.Title,
                Description = cardCreated.Description,
                CardPosition = cardCreated.CardPosition,
                IsDone = cardCreated.IsDone,
                DueDate = cardCreated.DueDate,
                Priority = cardCreated.Priority,
                BoardListId = cardCreated.BoardListId,
            }); 
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning("Failed to Add new card, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<CardInfoResponse>.Failed(ErrorType.NotFound, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to Add new card, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<CardInfoResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }
}
