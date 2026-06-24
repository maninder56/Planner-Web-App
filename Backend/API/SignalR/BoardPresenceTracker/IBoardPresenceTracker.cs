namespace API.SignalR.BoardPresenceTracker;

public interface IBoardPresenceTracker
{
    bool AddConnection(int boardId, int userId, string connectionId);

    void RemoveConnection(int boardId, int userId, string connectionId);

    bool IsUserInBoard(int boardId, int userId);

    IReadOnlyCollection<int> GetUsersInBoard(int boardId);

    public List<string> GetConnectionIDsOfUser(int userId); 

    public List<int> GetBoardsForUser(int userId); 
}
