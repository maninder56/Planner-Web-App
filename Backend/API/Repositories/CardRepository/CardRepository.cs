using API.DTOs.Card.Requests;
using API.Exceptions;
using DatabaseContext;
using DatabaseContext.Types; 
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


    // Update Operations

    public async Task<Card> UpdateCardAsync(int boardId, int listId, int cardId, UpdateCardRequest request)
    {
        Card card = await database.Cards
            .SingleOrDefaultAsync(c =>
                c.CardId == cardId &&
                c.BoardList.BoardListId == listId && 
                c.BoardList.BoardId == boardId)
            ?? throw new NotFoundException("Card not found");

        if (request.Title is string title)
        {
            card.Title = title;
        }

        if (request.Description is string description)
        {
            card.Description = description;
        }

        if (request.IsDone is bool isDone)
        {
            card.IsDone = isDone;
        }

        if (request.DueDate is DateOnly dateOnly)
        {
            card.DueDate = dateOnly;
        }

        if (request.Priority is Priority priority)
        {
            card.Priority = priority;
        }

        await database.SaveChangesAsync();
        return card;
    }
}
