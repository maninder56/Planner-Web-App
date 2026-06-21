using API.DTOs.Board.Requests;
using API.DTOs.Board.Responses;
using API.DTOs.List.Responses;
using API.Exceptions;
using API.Models.Result;
using API.Queries.Boards;
using API.Repositories.BoardRepository;
using API.SignalR.Hub;
using DatabaseContext;
using DatabaseContext.Types;
using Microsoft.AspNetCore.SignalR;

namespace API.Services.BoardService;

public class BoardService(
    ILogger<BoardService> logger, 
    BoardQueries boardQueries, 
    IBoardRepository boardRepository,
    IHubContext<GlobalHub, IGlobalHubClient> globalHubContext) : IBoardService
{
    // Read operations

    public async Task<Result<BoardDataResponse>> GetLastUsedBoardDataAsync(int userId)
    {
        var lastUsedBoardId = await boardQueries.GetBoardIdOfLastUsedBoardAsync(userId);

        if (lastUsedBoardId is null)
        {
            logger.LogWarning("Unable to find last board id of user with id: {Id}", userId);
            return Result<BoardDataResponse>.Failed(ErrorType.NotFound, "Resource Not found", 
                "User does not have last used board"); 
        }

        var boardData = await boardQueries.GetBoardDataAsync(userId, (int)lastUsedBoardId); 

        if (boardData is null)
        {
            logger.LogWarning("Unable to find board with id {Id}", lastUsedBoardId);
            return Result<BoardDataResponse>.Failed(ErrorType.NotFound, "Resource Not found", 
                "Can not find board data of last used board");
        }

        return Result<BoardDataResponse>.Success(boardData);
    }


    public async Task<Result<BoardDataResponse>> GetBoardDataAsync(int userId, int boardId)
    {
        var boardData = await boardQueries.GetBoardDataAsync(userId, boardId);

        if (boardData is null)
        {
            logger.LogWarning("Unable to find board with id {Id}", boardId);
            return Result<BoardDataResponse>.Failed(ErrorType.NotFound, "Resource Not found",
                "Can not find board data");
        }

        return Result<BoardDataResponse>.Success(boardData);
    }


    public async Task<Result<List<BoardDataResponse>>> GetAllBoards(int userId)
    {
        var boardList = await boardQueries.GetAllBoardsOfUserAsync(userId);

        if (boardList.Count == 0)
        {
            return Result<List<BoardDataResponse>>.Failed(ErrorType.NotFound, "Can not find any board");
        }
        else
        {
            return Result<List<BoardDataResponse>>.Success(boardList);
        }
    }


    public async Task<Result<BoardMember>> GetBoardMemberAsync(int userId, int boardId)
    {
        var boardMember = await boardQueries.GetBoardMemberAsync(userId, boardId);

        if (boardMember is null)
        {
            return Result<BoardMember>.Failed(ErrorType.NotFound, "Board not found"); 
        }

        return Result<BoardMember>.Success(boardMember);
    }

    public async Task<Result<List<BoardMemberResponse>>> GetAllMembersOfBoard(int boardId)
    {
        try
        {
            var boardMembers = await boardQueries.GetAllMembersOfBoard(boardId);
            return Result<List<BoardMemberResponse>>.Success(boardMembers);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to get board members info, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<List<BoardMemberResponse>>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }



    // Create operations

    public async Task<Result<BoardDataResponse>> CreateNewBoardAsync(int userId, NewBoardRequest newBoardRequest)
    {
        Board newBoard = new Board()
        {
            Name = newBoardRequest.Name,
            BackgroundColour = newBoardRequest.BackgroundColour,
        };

        BoardMember newBoardMember = new BoardMember()
        {
            UserId = userId,
            Role = Role.Owner,
            Board = newBoard,
        };

        BoardMember savedBoardMember = await boardRepository.CreateNewBoardAsync(newBoardMember);

        return Result<BoardDataResponse>.Success(new BoardDataResponse()
        {
            BoardId = savedBoardMember.BoardId,
            Name = savedBoardMember.Board.Name,
            Role = savedBoardMember.Role,
            BackgroundColour = savedBoardMember.Board.BackgroundColour, 
            IsFavoriteBoard = false,
        }); 
    }
    
    

    // Update operations

    public async Task<Result<BoardInfoResponse>> UpdateBoardInfoAsync(int userId, int boardId, BoardInfoChangeRequest request)
    {
        try
        {
            if (request.Name is not null || request.BackgroundColour is not null)
            {
                await boardRepository.UpdateBoardInfoAsync(userId, boardId, request.Name, request.BackgroundColour);
                
                string groupName = $"board:{boardId}";
                await globalHubContext.Clients.Group(groupName).BoardInfoChanged(new BoardInfoChangedResponse
                { 
                    BoardId = boardId,
                    ByUserId = userId,
                    NewBackgroundColour = request.BackgroundColour, 
                    NewBoardName = request.Name,
                }); 
            }

            if (request.IsFavoriteBoard is bool favorite)
            {
                await boardRepository.UpdateBoardStarAsync(userId, boardId, favorite); 
            }

            return Result<BoardInfoResponse>.Success(new BoardInfoResponse
            {
                Name = request.Name ?? null, 
                BackgroundColour = request.BackgroundColour ?? null,
                IsFavoriteBoard = request.IsFavoriteBoard ?? null,
            });
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning("Failed to update board info, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<BoardInfoResponse>.Failed(ErrorType.NotFound, ex.Message);    
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to update board info, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<BoardInfoResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error"); 
        }
    }


    public async Task<Result> UpdateLastUsedBoardAsync(int userId, LastUsedBoardChangeRequest request)
    {
        try
        {
            await boardRepository.UpdateLastUsedBoardAsync(userId, request.LastUsedBoardId);
            return Result.Success(); 
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to update last used board, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<BoardInfoResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }

    }


    public async Task<Result> UpdateBoardMembership(int userId, int boardId, UpdateBoardMembershipRequest request)
    {
        try
        {
            if (request.Roles.Any(r => r.userId == userId))
            {
                return Result.Failed(ErrorType.BadRequest, "Can not update role of owner"); 
            }

            var affectedUsers = await boardRepository.UpdateBoardMembership(boardId, request);

            string groupName = $"board:{boardId}";
            await globalHubContext.Clients.Group(groupName).UsersMembershipChnaged(
                affectedUsers.Select(bm => new NewBoardRoleResponse
            {
                BoardId = boardId,
                Email = bm.User.Email,
                UserId = userId,
                NewRole = bm.Role
            }).ToList()); 

            return Result.Success();

        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to get board members info, Exception Message: {ExceptionMessage}", ex.Message);
            return Result.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }



    // Delete operations

    public async Task<Result> DeleteBoardAsync(int userId, int boardId)
    {
        try
        {
            await boardRepository.DeleteBoardAsync(boardId);

            string groupName = $"board:{boardId}";
            await globalHubContext.Clients.Group(groupName).BoardHasBeenDeleted(new BoardDeletedResponse
            {
                ByUserId = userId,
                BoardId = boardId,
            });

            return Result.Success();
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning("Failed to delete board, Exception Message: {ExceptionMessage}", ex.Message);
            return Result.Failed(ErrorType.NotFound, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to delete board, Exception Message: {ExceptionMessage}", ex.Message);
            return Result.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }


    public async Task<Result> RemoveUserFromBoardAsync(int userId, int boardId, RemoveUserFromBoardRequest request)
    {
        try
        {
            if (userId == request.UserId)
            {
                return Result.Failed(ErrorType.BadRequest, "You can not remove yourself"); 
            }

            var user = await boardRepository.RemoveUserFromBoardAsync(request.UserId, boardId);

            if (user is not null)
            {
                string groupName = $"board:{boardId}";
                await globalHubContext.Clients.Group(groupName).UserHasBeenRemovedFromBoard(new UserRemovedFromBoardResponse
                {
                    userId = userId,
                    Email = user.Email,
                    BoardId = boardId,
                });
            }

            return Result.Success();
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning("Failed to delete board, Exception Message: {ExceptionMessage}", ex.Message);
            return Result.Failed(ErrorType.NotFound, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to remove user from board, Exception Message: {ExceptionMessage}", ex.Message);
            return Result.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }

}
