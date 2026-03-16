using API.DTOs.Board.Requests;
using API.DTOs.Board.Responses;
using API.Exceptions;
using API.Models.Result;
using API.Queries.Boards;
using API.Repositories.BoardRepository;
using DatabaseContext;
using DatabaseContext.Types;

namespace API.Services.BoardService;

public class BoardService(ILogger<BoardService> logger, BoardQueries boardQueries, IBoardRepository boardRepository) : IBoardService
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
            BoardInfoResponse boardInfoResponse = await boardRepository.UpdateBoardInfoAsync(userId, boardId, request);

            return Result<BoardInfoResponse>.Success(boardInfoResponse);
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
    


    // Delete operations

    public async Task<Result> DeleteBoardAsync(int boardId)
    {
        try
        {
            await boardRepository.DeleteBoardAsync(boardId);

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

}
