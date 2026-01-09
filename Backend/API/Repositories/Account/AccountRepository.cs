using API.Models.Account;
using API.Models.Result;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using MySqlConnector;
using System.Runtime.InteropServices;

namespace API.Repositories.Account;

public class AccountRepository : IAccountRepository
{
    private ILogger logger; 
    private PlannerContext database; 

    public AccountRepository(ILogger logger, PlannerContext context)
    {
        this.logger = logger;
        this.database = context;
    }

    // Create Operations

    public async Task<Result<CreatedUser, Error>> CreateUserAsync(string username, string email, string passwordHash)
    {
        try
        {
            User newUser = new User
            {
                Name = username,
                Email = email,
                PasswordHash = passwordHash,
                Guest = false,
                LastBoardId = null
            }; 
        
            database.Users.Add(newUser);
            await database.SaveChangesAsync(); 

            return Result<CreatedUser, Error>.Success(new CreatedUser { UserId = newUser.UserId, Email = email, Name = username });
        }
        catch(DbUpdateException ex)
        {
            var sqlEx = ex.GetBaseException() as MySqlException;

            if (sqlEx is not null && sqlEx.Number == 1062) // Check if email was duplicate
            {
                logger.LogError("Failed to Create new user account with email {Email} which already exists.", email);
                return Result<CreatedUser, Error>.Failed(Error.InternalServerError);
            }

            logger.LogError("Failed to Create New User account with email {Email}", email);
            return Result<CreatedUser, Error>.Failed(Error.InternalServerError);
        }
        catch (Exception ex)
        {
            logger.LogError("Failed to Create New User account with email {Email} and Exception message: {ExMessage}", email, ex.Message);
            return Result<CreatedUser, Error>.Failed(Error.InternalServerError); 
        }
    }
}
