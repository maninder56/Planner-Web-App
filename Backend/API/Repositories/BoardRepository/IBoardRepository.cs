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
    public Task UpdateBoardInfoAsync(int userId, int boardId, string? newName, string? newBackgroundColour); 

    public Task UpdateBoardStarAsync(int userId, int boardId, bool isFavorite);

    public Task UpdateLastUsedBoardAsync(int userId, int newLastUsedBoardId); 

    // Delete
    public Task DeleteBoardAsync(int boardId); 
}
