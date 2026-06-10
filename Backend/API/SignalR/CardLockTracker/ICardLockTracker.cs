using API.Models.Card;

namespace API.SignalR.CardLockTracker; 

public interface ICardLockTracker
{
    public bool LockCard(CardLockInfo cardLockInfo);
    public bool UnlockCard(int cardId, int userId);
    public bool IsCardLocked(int cardId);
    public bool IsCardLockedByAnotherUser(int cardId, int UserId); 

    public bool UserHasACardLocked(int userId);
    public bool UnlockAllCardsFromUser(int userId);
    public bool UnlockAllCardsFromUserInBoard(int userId, int boardId);
}
