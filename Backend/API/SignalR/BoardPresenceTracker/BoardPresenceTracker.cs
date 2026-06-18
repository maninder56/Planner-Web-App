using System.Collections.Concurrent;
using System.Text;

namespace API.SignalR.BoardPresenceTracker; 

public class BoardPresenceTracker(ILogger<BoardPresenceTracker> _logger) : IBoardPresenceTracker
{
    private readonly ConcurrentDictionary<int,ConcurrentDictionary<int, HashSet<string>>> _boards = new();

    public bool AddConnection(int boardId, int userId, string connectionId)
    {
        var boardUsers = _boards.GetOrAdd(boardId, _ =>
            new ConcurrentDictionary<int, HashSet<string>>());

        var connections = boardUsers.GetOrAdd(userId, _ =>
            new HashSet<string>());

        lock (connections)
        {
            bool isFirstConnection = connections.Count == 0; 

            connections.Add(connectionId);

            LogState(
            $"USER JOINED | board={boardId} | user={userId} | connection={connectionId}");

            return isFirstConnection; 
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

        LogState(
            $"USER Left | board={boardId} | user={userId} | connection={connectionId}");
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

    public List<int> GetBoardsForUser(int userId)
    {
        var result = new List<int>();

        foreach (var board in _boards)
        {
            if (board.Value.ContainsKey(userId))
            {
                result.Add(board.Key);
            }
        }

        return result;
    }


    private void LogState(string message)
    {
        var sb = new StringBuilder();

        sb.AppendLine("=================================");
        sb.AppendLine(message);

        if (_boards.IsEmpty)
        {
            sb.AppendLine("TRACKER STATE: EMPTY");
            sb.AppendLine("=================================");

            _logger.LogInformation(sb.ToString());

            return;
        }

        foreach (var board in _boards)
        {
            sb.AppendLine($"BOARD {board.Key}");

            foreach (var user in board.Value)
            {
                string connections;

                lock (user.Value)
                {
                    connections = string.Join(", ", user.Value);
                }

                sb.AppendLine(
                    $"  USER {user.Key} -> [{connections}]");
            }
        }

        sb.AppendLine("=================================");

        _logger.LogInformation(sb.ToString());
    }
}
