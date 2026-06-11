using API.Models.Card;
using System.Collections.Concurrent;

namespace API.SignalR.CardLockTracker; 

public class CardLockTracker : ICardLockTracker
{
    private readonly ConcurrentDictionary<int, CardLockInfo> _cardLocks = new ConcurrentDictionary<int, CardLockInfo>(); 

    public bool LockCard(CardLockInfo cardLockInfo)
    {
        var success = _cardLocks.TryAdd(cardLockInfo.CardId, cardLockInfo);

        return success;
    }

    public bool UnlockCard(int cardId, int userId)
    {
        if (_cardLocks.TryGetValue(cardId, out var lockInfo) && 
            lockInfo.UserId == userId)
        {
            return _cardLocks.TryRemove(cardId, out _);
        }

        return false;
    }

    public bool IsCardLocked(int cardId)
    {
        return _cardLocks.ContainsKey(cardId);
    }

    public bool IsCardLockedByAnotherUser(int cardId, int UserId)
    {
        return _cardLocks.Any(card => card.Key == cardId && card.Value.UserId !=  UserId);
    }

    public bool UserHasACardLocked(int userId)
    {
        return _cardLocks.Any(card  => card.Value.UserId == userId);
    }

    public List<CardLockInfo> GetAllCardsLockedInBoard(int boardId)
    {
        return _cardLocks.Where(card => card.Value.BoardId == boardId)
            .Select(card => card.Value).ToList();   
    }

    public bool UnlockAllCardsFromUser(int userId)
    {
        var cardsLocked = _cardLocks
            .Where(card => card.Value.UserId == userId)
            .Select(card => card.Key);

        foreach(var cardId in cardsLocked)
        {
            _cardLocks.TryRemove(cardId, out _);
        }

        return !UserHasACardLocked(userId);
    }

    public bool UnlockAllCardsFromUserInBoard(int userId, int boardId)
    {
        var cardsLocked = _cardLocks
            .Where(card => card.Value.UserId == userId && card.Value.BoardId == boardId)
            .Select(card => card.Key);

        foreach (var cardId in cardsLocked)
        {
            _cardLocks.TryRemove(cardId, out _);
        }

        var anyCardLocked = !_cardLocks.Any(card => 
            card.Value.UserId == userId && card.Value.BoardId == boardId);

        return anyCardLocked; 
    }
}
