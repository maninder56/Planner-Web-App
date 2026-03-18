using API.DTOs.Card.Requests;
using DatabaseContext;

namespace API.Repositories.CardRepository; 

public interface ICardRepository
{
    // Create operations
    public Task<Card> CreateNewCardAsync(int boardId, int listId, NewCardRequest request); 
}
