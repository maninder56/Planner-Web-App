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

    
}
