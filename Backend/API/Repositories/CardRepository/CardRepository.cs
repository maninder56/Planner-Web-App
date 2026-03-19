using API.DTOs.Card.Requests;
using API.Exceptions;
using DatabaseContext;
using DatabaseContext.Types; 
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

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


    public async Task UpdateCardOrderAsync(int boardId, UpdateCardOrderRequest request)
    {
        await using var transaction = await database.Database.BeginTransactionAsync();

        // Validate list IDs
        var requestedListIds = request.ListsAndCards
            .Select(lc => lc.ListId)
            .Distinct()
            .ToList();

        var validListIds = await database.BoardLists
            .Where(bl => bl.BoardId == boardId && requestedListIds.Contains(bl.BoardListId))
            .Select(bl => bl.BoardListId)
            .ToListAsync();

        if (validListIds.Count != requestedListIds.Count)
        {
            throw new BadRequestException("Invalid list IDs");
        }

        // Validate card IDs 
        var requestedCardIDs = request.ListsAndCards
            .SelectMany(lc => lc.CardIDsInOrder)
            .ToList();

        List<Card> cards = await database.Cards
            .Where(c => c.BoardList.BoardId == boardId && requestedCardIDs.Contains(c.CardId))
            .ToListAsync();

        if (cards.Count != requestedCardIDs.Count)
        {
            throw new BadRequestException("Some cards do not belong to this board");
        }
        
        // Make hashmap of cards with cardId as key, position and parent ListId as values
        var positionAndParentList = request.ListsAndCards
            .SelectMany(lc => lc.CardIDsInOrder
                .Select((cardId, index) => (lc.ListId, cardId, index)))
            .ToDictionary(
                o => o.cardId, 
                o => (o.ListId, position: o.index )); 

        foreach (var card in cards)
        {
            if (positionAndParentList.TryGetValue(card.CardId, out var positionAndParent))
            {
                if (card.BoardListId != positionAndParent.ListId || card.CardPosition != positionAndParent.position)
                {
                    card.BoardListId = positionAndParent.ListId;
                    card.CardPosition = positionAndParent.position;
                }
            }
        }

        await database.SaveChangesAsync(); 

        await transaction.CommitAsync();    
    }
}
