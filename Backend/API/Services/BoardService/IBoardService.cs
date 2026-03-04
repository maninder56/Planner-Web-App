using API.DTOs.Board;
using API.Models.Result;

namespace API.Services.BoardService; 

public interface IBoardService
{
    public Task<Result<BoardDataDTO, Error>> GetLastUsedBoardData(HttpContext httpContext); 
}
