using API.DTOs.Board;
using API.Models.Result;
using API.Repositories.BoardRepository;
using DatabaseContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.Board;

public class BoardRepository : IBoardRepository
{
    private ILogger<BoardRepository> logger;

    private PlannerContext database; 

    public BoardRepository(ILogger<BoardRepository> logger, PlannerContext database)
    {
        this.logger = logger;
        this.database = database;
    }

    public async Task<Result<BoardDataDTO, ErrorType>> GetBoardData(int userId, int boardId)
    {

        var isFavoriteBoard = await database.BoardStars
            .AnyAsync(bs => bs.BoardId == boardId && bs.UserId == userId); 

        var board = await database.Boards
            .Where(b => b.BoardId == boardId)
            .Select(b => new BoardDataDTO
            {
                BoardId = b.BoardId,
                Name = b.Name,
                IsFavoriteBoard = isFavoriteBoard,  
                BackgroundColour = b.BackgroundColour

            }).SingleOrDefaultAsync(); 
        
        if (board is null)
        {
            return Result<BoardDataDTO, ErrorType>.Failed(ErrorType.NotFound, new ProblemDetails()
            {
                Title = "Board does not exists"
            }); 
        }

        var boardList = await database.BoardLists
            .Where(bl => bl.BoardId == boardId)
            .Select(bl => new BoardListDTO
            {
                BoardListId = bl.BoardListId,
                Name = bl.Name,
                ListPosition = bl.ListPosition,
                CardList = bl.Cards
                    .Where(c => c.BoardListId == bl.BoardListId)
                    .Select(c => new BoardCardDTO
                    {
                        CardId = c.CardId,
                        Title = c.Title,
                        Description = c.Description,
                        IsDone = c.IsDone,
                        Priority = c.Priority.ToString(),
                        DueDate = c.DueDate,
                        CardPosition = c.CardPosition,
                    }).ToList(),
            }).ToListAsync();

        board.BoardList = boardList;

        return Result<BoardDataDTO, ErrorType>.Success(board);
    }

    public async Task<Result<int, ErrorType>> GetLastUsedBoardId(int userId)
    {
        var boardId = await database.Users
            .Where(u => u.UserId == userId)
            .Select(u => u.LastBoardId)
            .SingleOrDefaultAsync();   

        if (boardId is null)
        {

        }

        throw new NotImplementedException(); 
    }
}
