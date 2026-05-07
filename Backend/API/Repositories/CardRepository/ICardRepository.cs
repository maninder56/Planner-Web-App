using API.DTOs.Card.Requests;
using DatabaseContext;

namespace API.Repositories.CardRepository; 

public interface ICardRepository
{
    // Create operations
    public Task<Card> CreateNewCardAsync(int boardId, int listId, NewCardRequest request);

    // update operations
    public Task<Card> UpdateCardAsync(int boardId, int listId, int cardId, UpdateCardRequest request);

    public Task UpdateCardOrderAsync(int boardId, UpdateCardOrderRequest request);


    // delete operations
    public Task DeleteCardAsync(int boardId, int listId, int cardId); 
}
