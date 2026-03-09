using API.DTOs.Board.Requests;
using API.DTOs.Board.Responses;
using API.Models.Result;
using API.Queries.Boards;

namespace API.Services.BoardService;

public class BoardService(ILogger<BoardService> logger, BoardQueries boardQueries) : IBoardService
{
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

        var boardListAndCardsData = await boardQueries.GetBoardListDataAndCardsDataAsync((int)lastUsedBoardId); 

        boardData.BoardList = boardListAndCardsData;

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

        var boardListAndCardsData = await boardQueries.GetBoardListDataAndCardsDataAsync(boardId);

        boardData.BoardList = boardListAndCardsData;

        return Result<BoardDataResponse>.Success(boardData);
    }


    public async Task<Result<BoardDataResponse>> CreateNewBoardAsync(NewBoardRequest newBoard)
    {
        throw new NotImplementedException();
    }
}
