using API.DTOs.Board;
using API.Models.Result;
using API.Queries.Boards;

namespace API.Services.BoardService;

public class BoardService(ILogger<BoardService> logger, BoardQueries boardQueries) : IBoardService
{
    public async Task<Result<BoardDataDTO>> GetLastUsedBoardData(int userId)
    {
        var lastUsedBoardId = await boardQueries.GetBoardIdOfLastUsedBoard(userId);

        if (lastUsedBoardId is null)
        {
            logger.LogWarning("Unable to find last board id of user with id: {Id}", userId);
            return Result<BoardDataDTO>.Failed(ErrorType.NotFound, "Resource Not found", "User does not have last used board"); 
        }

        var boardData = await boardQueries.GetBoardData(userId, (int)lastUsedBoardId); 

        if (boardData is null)
        {
            logger.LogWarning("Unable to find board with id {Id}", lastUsedBoardId);
            return Result<BoardDataDTO>.Failed(ErrorType.NotFound, "Resource Not found", "Can not find board data of last used board");
        }

        var boardListAndCardsData = await boardQueries.GetBoardListDataAndCardsData((int)lastUsedBoardId); 

        boardData.BoardList = boardListAndCardsData;

        return Result<BoardDataDTO>.Success(boardData);
    }
}
