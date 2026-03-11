using API.DTOs.Board;
using API.Models.Result;
using API.Repositories.BoardRepository;
using DatabaseContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.BoardRepository;

public class BoardRepository : IBoardRepository
{
    private ILogger<BoardRepository> logger;

    private PlannerContext database; 

    public BoardRepository(ILogger<BoardRepository> logger, PlannerContext database)
    {
        this.logger = logger;
        this.database = database;
    }

    public async Task<Board> CreateNewBoardAsync(Board newBoard)
    {
        database.Boards.Add(newBoard);
        await database.SaveChangesAsync(); 
        return newBoard;
    }

    public async Task<BoardMember> CreateNewBoardMemberAsync(BoardMember boardMembers)
    {
        database.BoardMembers.Add(boardMembers);
        await database.SaveChangesAsync();
        return boardMembers;
    }
    
}
