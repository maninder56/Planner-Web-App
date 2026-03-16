using API.DTOs.Board;
using API.DTOs.Board.Requests;
using API.DTOs.Board.Responses;
using API.Exceptions;
using API.Models.Result;
using API.Queries.Boards;
using API.Repositories.BoardRepository;
using DatabaseContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Pomelo.EntityFrameworkCore.MySql.Query.ExpressionVisitors.Internal;
using System.Diagnostics.Eventing.Reader;

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


    public async Task<BoardMember> CreateNewBoardAsync(BoardMember boardMembers)
    {
        database.BoardMembers.Add(boardMembers);
        await database.SaveChangesAsync();
        return boardMembers;
    }


    public async Task<BoardInfoResponse> UpdateBoardInfoAsync(int userId, int boardId, BoardInfoChangeRequest request)
    {
        Board board = await database.Boards
                .Where(b => b.BoardId == boardId)   
                .SingleOrDefaultAsync()
                ?? throw new NotFoundException("Board not found");

        var boardStar = await database.BoardStars
                .SingleOrDefaultAsync(bs => bs.UserId == userId && bs.BoardId == boardId);

        bool isFavorite = boardStar is not null; 

        BoardInfoResponse boardInfoResponse = new BoardInfoResponse();

        if (request.BackgroundColour is not null)
        {
            board.BackgroundColour = request.BackgroundColour;
            boardInfoResponse.BackgroundColour = request.BackgroundColour;
        }

        if (request.Name is not null)
        {
            board.Name = request.Name;
            boardInfoResponse.Name = request.Name;
        }

        if (request.IsFavoriteBoard is bool favorite)
        {
            if (favorite && boardStar is null)
            {
                database.BoardStars.Add(new BoardStar { UserId = userId, BoardId = boardId }); 
                isFavorite = true;
            }
            else if (!favorite && boardStar is not null) 
            {
                database.BoardStars.Remove(boardStar); 
                isFavorite = false;
            }

            boardInfoResponse.IsFavoriteBoard = favorite; 
        }

        await database.SaveChangesAsync();

        return boardInfoResponse; 
    }


    public async Task DeleteBoardAsync(int userId, int boardId)
    {
        Board board = await database.BoardMembers
            .Include(bm => bm.Board)
            .WhereUserHasAccess(userId, boardId)
            .Select(bm => bm.Board)
            .SingleOrDefaultAsync()
            ?? throw new NotFoundException("Board not found"); 

        database.Boards.Remove(board);

        await database.SaveChangesAsync();
    }
    
}
