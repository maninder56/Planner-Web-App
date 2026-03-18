using API.DTOs.Card.Requests;
using API.Exceptions;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.CardRepository; 

public class CardRepository (PlannerContext database) : ICardRepository
{
    // Create operations
    public async Task<Card> CreateNewCardAsync(int boardId, int listId, NewCardRequest request)
    {
        var query = await database.BoardLists
            .Where(bl => bl.BoardListId == listId && bl.BoardId == boardId)
            .Select(bl => new
            {
                lastCardPosition = bl.Cards.Max(c => (int?) c.CardPosition),
            })
            .SingleOrDefaultAsync();

        if (query is null)
        {
            throw new NotFoundException("List not found"); 
        }

        Card newCard = new Card()
        {
            Title = request.Title,
            Description = request.Description,
            CardPosition = (query.lastCardPosition ?? -1) + 1, 
            IsDone = request.IsDone,
            DueDate = request.DueDate,
            Priority = request.Priority,
            BoardListId = listId,
        };  

        database.Cards.Add(newCard);

        await database.SaveChangesAsync();

        return newCard;
    }
}
