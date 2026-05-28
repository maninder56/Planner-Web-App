using System.Collections.Concurrent;

namespace API.SignalR.BoardPresenceTracker; 

public class BoardPresenceTracker : IBoardPresenceTracker
{
    private readonly ConcurrentDictionary<int,ConcurrentDictionary<int, HashSet<string>>> _boards = new();

    public void AddConnection(int boardId, int userId, string connectionId)
    {
        var boardUsers = _boards.GetOrAdd(boardId, _ =>
            new ConcurrentDictionary<int, HashSet<string>>());

        var connections = boardUsers.GetOrAdd(userId, _ =>
            new HashSet<string>());

        lock (connections)
        {
            connections.Add(connectionId);
        }
    }

    public void RemoveConnection(int boardId, int userId, string connectionId)
    {
        if (!_boards.TryGetValue(boardId, out var boardUsers))
            return;

        if (!boardUsers.TryGetValue(userId, out var connections))
            return;

        lock (connections)
        {
            connections.Remove(connectionId);

            // remove user if no active tabs/connections
            if (connections.Count == 0)
            {
                boardUsers.TryRemove(userId, out _);
            }
        }

        // cleanup empty board
        if (boardUsers.IsEmpty)
        {
            _boards.TryRemove(boardId, out _);
        }
    }

    public bool IsUserInBoard(int boardId, int userId)
    {
        return _boards.TryGetValue(boardId, out var boardUsers)
            && boardUsers.ContainsKey(userId);
    }

    public IReadOnlyCollection<int> GetUsersInBoard(int boardId)
    {
        if (!_boards.TryGetValue(boardId, out var boardUsers))
            return [];

        return boardUsers.Keys.ToList();
    }
}
