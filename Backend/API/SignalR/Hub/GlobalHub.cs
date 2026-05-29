using API.DTOs.Board.Responses;
using API.DTOs.User.Responses;
using API.Extensions;
using API.Models.Account;
using API.Queries.Boards;
using API.Queries.Profile;
using API.SignalR.BoardPresenceTracker;
using DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR.Hub;

[Authorize]
public class GlobalHub(
    IBoardPresenceTracker presenceTracker, 
    BoardQueries boardQueries, ProfileQueries profileQueries, 
    ILogger<GlobalHub> _logger) : Hub<IGlobalHubClient>
{
    public async Task<JoinBoardResponse> JoinBoard(int boardId)
    {
        int? userId = Context.User?.GetUserId();

        if (userId is null)
        {
            _logger.LogWarning("JoinBoard failed. Invalid user. ConnectionId: {ConnectionId}, BoardId: {BoardId}",
                Context.ConnectionId, boardId);
            return new JoinBoardResponse() { success = false, message = "Invalid User" }; 
        }

        var boardMember = await boardQueries.GetBoardMemberAsync((int)userId, boardId);
        var userProfile = await profileQueries.GetUserProfileInfoAsync((int)userId); 

        if (boardMember is null || userProfile is null)
        {
            _logger.LogWarning("Unauthorized board access attempt. UserId: {UserId}, BoardId: {BoardId}", userId, boardId);
            return new JoinBoardResponse() { success = false, message = "Unauthorized" };
        }

        string groupName = $"board:{boardId}"; 

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        presenceTracker.AddConnection(boardId, (int)userId, Context.ConnectionId);

        await Clients.Group(groupName).UserHasJoinedTheBoard(new UserJoiningInfoResponse()
        {
            UserId = (int)userId,
            BoardId = boardId, 
            Name = userProfile.Name,
            Email = userProfile.Email,
        }); 

        return new JoinBoardResponse() { success = true, message = string.Empty };
    }

    public async Task<LeaveBoardResponse> LeaveBoard(int boardId)
    {
        int? userId = Context.User?.GetUserId();

        if (userId is null)
        {
            _logger.LogWarning("JoinBoard failed. Invalid user. ConnectionId: {ConnectionId}, BoardId: {BoardId}",
                Context.ConnectionId, boardId);
            return new LeaveBoardResponse() { success = true, message = string.Empty };
        }

        string groupName = $"board:{boardId}";

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

        presenceTracker.RemoveConnection(boardId, (int)userId, Context.ConnectionId);

        bool stillPresent = presenceTracker.IsUserInBoard(boardId, (int)userId);

        // only notify if user fully left
        if (!stillPresent)
        {
            await Clients.Group(groupName).UserHasLeftTheBoard(new UserLeavingInfoResponse
            {
                UserId = (int)userId
            });
        }

        return new LeaveBoardResponse() { success = true, message = string.Empty };

    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        int? userId = Context.User?.GetUserId();

        if (userId is null)
        {
            _logger.LogWarning("Clean up failed. Invalid user. ConnectionId: {ConnectionId}", Context.ConnectionId); 
            await base.OnDisconnectedAsync(exception);
            return;
        }

        var boards = presenceTracker.GetBoardsForUser((int)userId); 


        foreach (var boardId in boards)
        {
            presenceTracker.RemoveConnection(boardId, (int)userId, Context.ConnectionId); 

            if (!presenceTracker.IsUserInBoard(boardId, (int)userId))
            {
                string groupName = $"board:{boardId}";

                await Clients.Group(groupName).UserHasLeftTheBoard(new UserLeavingInfoResponse
                {
                    UserId = (int)userId
                });
            }
        }


        await base.OnDisconnectedAsync(exception);
    }
}
