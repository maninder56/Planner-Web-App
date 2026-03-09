using API.DTOs.Board.Responses;
using API.Models.Result;

namespace API.Services.BoardService; 

public interface IBoardService
{
    public Task<Result<BoardDataResponse>> GetLastUsedBoardDataAsync(int userId); 
}
