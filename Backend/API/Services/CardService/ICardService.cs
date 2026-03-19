using API.DTOs.Board.Responses;
using API.DTOs.Card.Requests;
using API.DTOs.Card.Responses;
using API.Models.Result;

namespace API.Services.CardService; 

public interface ICardService
{
    // Read operations
    public Task<Result<SearchResponse>> SearchCardByKeyword(int userId, string keyword);

    // Create operations
    public Task<Result<CardInfoResponse>> CreateNewCardAsync(int boardId, int listId, NewCardRequest request);

    // Update operations 
    public Task<Result<UpdateCardResponse>> UpdateCardInfo(int boardId, int listId, int cardId, UpdateCardRequest request); 
}
