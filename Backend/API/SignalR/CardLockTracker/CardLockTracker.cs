using API.Models.Card;
using System.Collections.Concurrent;
using System.Text;

namespace API.SignalR.CardLockTracker; 

public class CardLockTracker(ILogger<CardLockTracker> logger) : ICardLockTracker
{
    private readonly ConcurrentDictionary<int, CardLockInfo> _cardLocks = new ConcurrentDictionary<int, CardLockInfo>(); 

    public bool LockCard(CardLockInfo cardLockInfo)
    {
        var success = _cardLocks.TryAdd(cardLockInfo.CardId, cardLockInfo);
        LogCurrentState(); 

        return success;
    }

    public bool UnlockCard(int cardId, int userId)
    {
        if (_cardLocks.TryGetValue(cardId, out var lockInfo) && 
            lockInfo.UserId == userId)
        {
            return _cardLocks.TryRemove(cardId, out _);
        }
        LogCurrentState();
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
        LogCurrentState(); 
        return _cardLocks.Where(card => card.Value.BoardId == boardId)
            .Select(card => card.Value).ToList()
            ?? new List<CardLockInfo>();   
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

        LogCurrentState(); 

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

        LogCurrentState(); 

        return anyCardLocked; 
    }


    public void LogCurrentState()
    {
        var sb = new StringBuilder();

        sb.AppendLine("=== Card Lock Tracker State ===");
        sb.AppendLine($"Total Locks: {_cardLocks.Count}");

        if (_cardLocks.IsEmpty)
        {
            sb.AppendLine("No cards are currently locked.");
        }
        else
        {
            foreach (var cardLock in _cardLocks.Values
                         .OrderBy(x => x.BoardId)
                         .ThenBy(x => x.CardId))
            {
                sb.AppendLine(
                    $"BoardId: {cardLock.BoardId}, " +
                    $"CardId: {cardLock.CardId}, " +
                    $"UserId: {cardLock.UserId}");
            }
        }

        logger.LogInformation("{TrackerState}", sb.ToString());
    }
}
