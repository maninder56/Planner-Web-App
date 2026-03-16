using API.DTOs.Board.Requests;
using API.DTOs.Board.Responses;
using API.Models.Result;
using DatabaseContext;

namespace API.Services.BoardService; 

public interface IBoardService
{
    // Read
    public Task<Result<BoardDataResponse>> GetLastUsedBoardDataAsync(int userId);
    public Task<Result<BoardDataResponse>> GetBoardDataAsync(int userId, int boardId);
    public Task<Result<List<BoardDataResponse>>> GetAllBoards(int userId);
    public Task<Result<BoardMember>> GetBoardMemberAsync(int userId, int boardId); 


    // Create 
    public Task<Result<BoardDataResponse>> CreateNewBoardAsync(int userId, NewBoardRequest newBoardRequest);

    // Update 
    public Task<Result<BoardInfoResponse>> UpdateBoardInfoAsync(int userId, int boardId, BoardInfoChangeRequest request);


    // Delete 
    public Task<Result> DeleteBoardAsync(int userId, int boardId); 
}
