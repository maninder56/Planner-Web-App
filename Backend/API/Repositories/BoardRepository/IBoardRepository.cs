using API.DTOs.Board;
using API.DTOs.Board.Requests;
using API.DTOs.Board.Responses;
using API.Models.Result;
using DatabaseContext;
using DatabaseContext.Types;

namespace API.Repositories.BoardRepository; 

public interface IBoardRepository
{
    // Create 
    public Task<BoardMember> CreateNewBoardAsync(BoardMember boardMembers);
    public Task<BoardMember> CreateNewBoardMemberAsync(int userID, int boardID, Role role);

    // Update 
    public Task<BoardMember> UpdateBoardMemberRoleAsync(int userID, int boardID, Role role); 
    public Task UpdateBoardInfoAsync(int userId, int boardId, string? newName, string? newBackgroundColour); 

    public Task UpdateBoardStarAsync(int userId, int boardId, bool isFavorite);

    public Task UpdateLastUsedBoardAsync(int userId, int newLastUsedBoardId);

    public Task UpdateBoardMembership(int boardId, UpdateBoardMembershipRequest request); 

    // Delete
    public Task DeleteBoardAsync(int boardId); 
}
