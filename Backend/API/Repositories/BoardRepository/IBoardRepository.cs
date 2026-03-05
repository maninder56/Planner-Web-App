using API.DTOs.Board;
using API.Models.Result;
using DatabaseContext;

namespace API.Repositories.BoardRepository; 

public interface IBoardRepository
{
    // Read operations
    public Task<Result<BoardDataDTO, ErrorType>> GetBoardData(int userId, int boardId); 
    public Task<Result<int, ErrorType>> GetLastUsedBoardId(int userId);
}
