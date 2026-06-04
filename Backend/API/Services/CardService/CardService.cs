using API.DTOs.Board.Responses;
using API.DTOs.Card.Models;
using API.DTOs.Card.Requests;
using API.DTOs.Card.Responses;
using API.DTOs.List.Responses;
using API.Exceptions;
using API.Models.Result;
using API.Queries.Boards;
using API.Queries.Cards;
using API.Repositories.CardRepository;
using API.SignalR.Hub;
using DatabaseContext;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;

namespace API.Services.CardService; 

public class CardService(
    ILogger<CardService> logger, 
    CardQueries cardQueries, 
    ICardRepository cardRepository,
    IHubContext<GlobalHub, IGlobalHubClient> globalHubContext) : ICardService
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

    public async Task<Result<CardInfoResponse>> CreateNewCardAsync(int userId, int boardId, int listId, NewCardRequest request)
    {
        try
        {
            Card cardCreated = await cardRepository.CreateNewCardAsync(boardId, listId, request);

            string groupName = $"board:{boardId}";
            await globalHubContext.Clients.Group(groupName).NewCardAdded(new NewCardAddedResponse
            {
                ByUserId = userId, 
                BoardId = boardId,
                CardId = cardCreated.CardId,
                Title = cardCreated.Title,
                Description = cardCreated.Description,
                CardPosition = cardCreated.CardPosition,
                IsDone = cardCreated.IsDone,
                DueDate = cardCreated.DueDate,
                Priority = cardCreated.Priority,
                BoardListId = cardCreated.BoardListId,
            });

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


    // Update operations
    
    public async Task<Result<UpdateCardResponse>> UpdateCardInfo(int userId, int boardId, int listId, int cardId, UpdateCardRequest request)
    {
        try
        {
            Card updatedCard = await cardRepository.UpdateCardAsync(boardId, listId, cardId, request);

            string groupName = $"board:{boardId}";
            await globalHubContext.Clients.Group(groupName).CardHasBeenUpdated(new CardUpdatedResponse
            {
                ByUserId = userId,
                BoardId = boardId,
                ListId = listId,
                CardId = updatedCard.CardId,
                Title = request.Title,
                Description = request.Description,
                IsDone = request.IsDone,
                DueDate = request.DueDate,
                Priority = request.Priority,
            });

            return Result<UpdateCardResponse>.Success(new UpdateCardResponse
            {
                CardId = updatedCard.CardId,
                Title = request.Title,
                Description = request.Description,
                IsDone = request.IsDone,
                DueDate = request.DueDate,
                Priority = request.Priority,
            }); 
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning("Failed to update card info, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<UpdateCardResponse>.Failed(ErrorType.NotFound, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to update card info, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<UpdateCardResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }


    public async Task<Result> UpdateCardOrderAsync(int userId, int boardId, UpdateCardOrderRequest request)
    {
        try
        {
            await cardRepository.UpdateCardOrderAsync(boardId, request);

            int numberOfLists = request.ListsAndCards.Count;

            string groupName = $"board:{boardId}";
            await globalHubContext.Clients.Group(groupName).CardPositionChanged(new UpdatedCardOrderResponse
            {
                BoardId = boardId, 
                ByUserId = userId,
                firstList = request.ListsAndCards[0], 
                secondList = numberOfLists > 1 ? request.ListsAndCards[1] : null,
            }); 

            return Result.Success(); 
        }
        catch (BadRequestException ex)
        {
            logger.LogWarning("Failed to update card order, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<UpdateCardResponse>.Failed(ErrorType.BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to update card order, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<UpdateCardResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }


    public async Task<Result> DeleteCardAsync(int userId, int boardId, int listId, int cardId)
    {
        try
        {
            await cardRepository.DeleteCardAsync(boardId, listId, cardId);

            string groupName = $"board:{boardId}";
            await globalHubContext.Clients.Group(groupName).CardHasBeenDeleted(new CardDeletedResponse
            {
                ByUserId = userId, ListId = listId, CardId = cardId, BoardId = boardId
            });

            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to delete card, Exception Message: {ExceptionMessage}", ex.Message);
            return Result.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }
}
