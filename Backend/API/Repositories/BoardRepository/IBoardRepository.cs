using API.DTOs.Board;
using API.DTOs.Board.Requests;
using API.DTOs.Board.Responses;
using API.Models.Result;
using DatabaseContext;

namespace API.Repositories.BoardRepository; 

public interface IBoardRepository
{
    // Create 
    public Task<BoardMember> CreateNewBoardAsync(BoardMember boardMembers);

    // Update 
    public Task<BoardInfoResponse> UpdateBoardInfoAsync(int userId, int boardId, BoardInfoChangeRequest request);

    // Delete
    public Task DeleteBoardAsync(int userId, int boardId); 
}
