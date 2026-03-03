using API.DTOs.Board;
using API.Models.Result;

namespace API.Repositories.Board; 

public interface IBoardRepository
{
    // Read operations
    public Task<Result<BoardDataDTO, Error>> GetBoardData(int boardId); 
}
