using API.DTOs.Board;
using API.Models.Result;

namespace API.Services.BoardService; 

public interface IBoardService
{
    public Task<Result<BoardDataDTO, ErrorType>> GetLastUsedBoardData(HttpContext httpContext); 
}
