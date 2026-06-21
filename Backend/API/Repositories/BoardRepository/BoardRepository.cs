using API.DTOs.Board;
using API.DTOs.Board.Requests;
using API.DTOs.Board.Responses;
using API.Exceptions;
using API.Models.Result;
using API.Queries.Boards;
using API.Repositories.BoardRepository;
using DatabaseContext;
using DatabaseContext.Types;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
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


    // Create operations

    public async Task<BoardMember> CreateNewBoardAsync(BoardMember boardMembers)
    {
        database.BoardMembers.Add(boardMembers);
        await database.SaveChangesAsync();
        return boardMembers;
    }

    public async Task<BoardMember> CreateNewBoardMemberAsync(int userID, int boardID, Role role)
    {
        var newBoard = new BoardMember()
        {
            BoardId = boardID,
            UserId = userID,
            Role = role
        }; 
        database.BoardMembers.Add(newBoard); 

        await database.SaveChangesAsync();
        return newBoard; 
    }

    // Update operations

    public async Task<BoardMember> UpdateBoardMemberRoleAsync(int userID, int boardID, Role role)
    {
        var board = await database.BoardMembers
            .FirstOrDefaultAsync(bm => bm.BoardId == boardID && bm.UserId == userID)
            ?? throw new NotFoundException("Boardmember not found");

        board.Role = role; 

        await database.SaveChangesAsync();
        return board;
    }

    public async Task UpdateBoardInfoAsync(int userId, int boardId, string? newName, string? newBackgroundColour)
    {
        Board board = await database.Boards
                .Where(b => b.BoardId == boardId)
                .SingleOrDefaultAsync()
                ?? throw new NotFoundException("Board not found");

        if (newName is not null)
        {
            board.Name = newName;
        }

        if (newBackgroundColour is not null)
        {
            board.BackgroundColour = newBackgroundColour;
        }

        await database.SaveChangesAsync(); 
    }

    public async Task UpdateBoardStarAsync(int userId, int boardId, bool isFavorite)
    {
        var boardStar = await database.BoardStars
            .SingleOrDefaultAsync(bs => bs.UserId == userId && bs.BoardId == boardId);

        if (isFavorite && boardStar is null)
        {
            database.BoardStars.Add(new BoardStar { UserId = userId, BoardId = boardId });
        }
        else if (!isFavorite && boardStar is not null)
        {
            database.BoardStars.Remove(boardStar); 
        }

        await database.SaveChangesAsync();
    }


    public async Task UpdateLastUsedBoardAsync(int userId, int newLastUsedBoardId)
    {
        await database.Users
            .Where(u => u.UserId == userId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(u => u.LastBoardId, newLastUsedBoardId)); 
    }


    public async Task<List<BoardMember>> UpdateBoardMembership(int boardId, UpdateBoardMembershipRequest request)
    {
        var boardMembers = await database.BoardMembers
            .Include(bm => bm.User)
            .Where(bm => bm.BoardId == boardId && bm.Role != Role.Owner)
            .ToListAsync();

        foreach (var member in boardMembers)
        {
            var newBoardRole = request.Roles
                .FirstOrDefault(r => r.userId  == member.UserId);

            if (newBoardRole is null)
            {
                continue;
            }

            member.Role = newBoardRole.NewRole;
        }

        await database.SaveChangesAsync();

        return boardMembers; 
    }


    // Delete operations

    public async Task DeleteBoardAsync(int boardId)
    {
        await database.Boards.Where(b => b.BoardId == boardId)
            .ExecuteDeleteAsync();
    }

    public async Task<User?> RemoveUserFromBoardAsync(int userIdToRemove, int boardId)
    {
        await database.BoardMembers.Where(
            bm => bm.UserId == userIdToRemove &&
            bm.BoardId == boardId && 
            bm.Role != Role.Owner)
            .ExecuteDeleteAsync();

        var user = await database.Users.FirstOrDefaultAsync(u => u.UserId == userIdToRemove);

        if (user is not null && user.LastBoardId == boardId)
        {
            user.LastBoardId = null; 
        }

        await database.BoardStars
            .Where(bs => bs.UserId == userIdToRemove && bs.BoardId == boardId)
            .ExecuteDeleteAsync();

        await database.SaveChangesAsync();

        return user; 
    }
    
}
