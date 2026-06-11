using API.DTOs.Board.Responses;
using API.DTOs.Card.Responses;
using API.DTOs.User.Responses;
using API.Extensions;
using API.Models.Account;
using API.Models.Card;
using API.Queries.Boards;
using API.Queries.Profile;
using API.SignalR.BoardPresenceTracker;
using API.SignalR.CardLockTracker;
using DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;

namespace API.SignalR.Hub;

[Authorize]
public class GlobalHub(
    IBoardPresenceTracker presenceTracker, ICardLockTracker cardLockTracker, 
    BoardQueries boardQueries, ProfileQueries profileQueries, 
    ILogger<GlobalHub> _logger,
    IAuthorizationService authorizationService) : Hub<IGlobalHubClient>
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

        bool isFirstJoin = presenceTracker.AddConnection(boardId, (int)userId, Context.ConnectionId);

        if (isFirstJoin)
        {
            await Clients.Group(groupName).UserHasJoinedTheBoard(new UserJoiningInfoResponse()
            {
                UserId = (int)userId,
                Name = userProfile.Name,
                Email = userProfile.Email,
            });
        }

        var userIDs = presenceTracker.GetUsersInBoard(boardId);
        var onlineUsersInfo = await profileQueries.GetUsersInfoAsync(userIDs.ToArray());
        await Clients.Caller.CurrentOnlineUsers(onlineUsersInfo);

        var lockedCardsInThisBoard = cardLockTracker.GetAllCardsLockedInBoard(boardId); 
        await Clients.Caller.CurrentlyLockedCards(new AllCardsLockedResponse
        { 
            lockedCards = lockedCardsInThisBoard 
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
        else
        {
            _logger.LogInformation("User still has not left"); 
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
                cardLockTracker.UnlockAllCardsFromUserInBoard((int)userId, boardId); 

                string groupName = $"board:{boardId}";

                await Clients.Group(groupName).UserHasLeftTheBoard(new UserLeavingInfoResponse
                {
                    UserId = (int)userId
                });
            }
        }


        await base.OnDisconnectedAsync(exception);
    }

    // Soft lock for card 
    public async Task<CardLockResponse> LockCard(int boardId, int cardId)
    {
        var user = Context.User;

        if (user is null)
        {
            return new CardLockResponse(false); 
        }

        var authResult = await authorizationService.AuthorizeAsync(
            user, boardId, "CanEditBoard");

        if (!authResult.Succeeded)
        {
            return new CardLockResponse(false);
        }

        int userId = user.GetUserId(); 

        if (cardLockTracker.UserHasACardLocked(userId))
        {
            var lockRemovedFromAllCards = cardLockTracker.UnlockAllCardsFromUser(userId);

            if (!lockRemovedFromAllCards)
            {
                return new CardLockResponse(false); 
            }
        }

        var lockInfo = new CardLockInfo
        { 
            BoardId = boardId, 
            CardId = cardId, 
            UserId = userId, 
            LockedAt = DateTime.Now 
        };

        var cardLocked = cardLockTracker.LockCard(lockInfo); 

        if (cardLocked)
        {
            string groupName = $"board:{boardId}";
            await Clients.Group(groupName).CardHasBeenLocked(new CardLockedByAnohterUserResponse
            { 
                BoardId = boardId, 
                CardId = cardId, 
                ByUserId = userId,  
                LockedAt = lockInfo.LockedAt, 
            }); 
        }

        return new CardLockResponse(cardLocked);
    }


    public async Task UnlockCard(int boardId, int cardId)
    {
        var user = Context.User;

        if (user is null)
        {
            return; 
        }

        var cardUnlocked = cardLockTracker.UnlockCard(cardId, user.GetUserId());

        if (cardUnlocked)
        {
            string groupName = $"board:{boardId}";
            await Clients.Group(groupName).CardHasBeenUnLocked(new CardUnLockedByAnohterUserResponse
            {
                BoardId = boardId,
                CardId = cardId,
                ByUserId = user.GetUserId(),
            });
        }
    }
}
