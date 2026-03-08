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
            return Result<BoardDataDTO>.Failed(ErrorType.NotFound, "Last")
        }
    }
}
