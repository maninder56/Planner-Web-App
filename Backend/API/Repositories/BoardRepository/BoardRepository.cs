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


    public async Task<BoardInfoResponse> UpdateBoardInfoAsync(int userId, int boardId, BoardInfoChangeRequest request)
    {
        BoardMember boardMember = await database.BoardMembers
                .Include(bm => bm.Board)
                .WhereUserHasAccess(userId, boardId)
                .SingleOrDefaultAsync()
                ?? throw new NotFoundException("Board not found");

        var boardStar = await database.BoardStars
                .SingleOrDefaultAsync(bs => bs.UserId == userId && bs.BoardId == boardId);

        bool isFavorite = boardStar is not null; 

        if (request.BackgroundColour is not null)
        {
            boardMember.Board.BackgroundColour = request.BackgroundColour;
        }

        if (request.Name is not null)
        {
            boardMember.Board.Name = request.Name;
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
        }

        await database.SaveChangesAsync();

        return new BoardInfoResponse
        {
            Name = boardMember.Board.Name, 
            BackgroundColour = boardMember.Board.BackgroundColour,
            IsFavoriteBoard = isFavorite,
        }; 
    }
    
}
