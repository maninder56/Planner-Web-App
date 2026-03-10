using API.DTOs.Board;
using API.Models.Result;
using DatabaseContext;

namespace API.Repositories.BoardRepository; 

public interface IBoardRepository
{
    public Task<Board> CreateNewBoardAsync(Board newBoard);
    public Task<BoardMember> CreateNewBoardMemberAsync(BoardMember boardMembers); 
}
