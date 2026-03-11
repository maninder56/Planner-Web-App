using API.DTOs.Board.Requests;
using API.DTOs.Board.Responses;
using API.Models.Result;

namespace API.Services.BoardService; 

public interface IBoardService
{
    public Task<Result<BoardDataResponse>> GetLastUsedBoardDataAsync(int userId);
    public Task<Result<BoardDataResponse>> GetBoardDataAsync(int userId, int boardId);

    public Task<Result<BoardDataResponse>> CreateNewBoardAsync(int userId, NewBoardRequest newBoardRequest); 
}
