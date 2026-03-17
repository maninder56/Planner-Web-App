using DatabaseContext;

namespace API.Repositories.ListRepository; 

public interface IListRepository
{
    public Task<BoardList> CreateNewBoardListAsync(int boardId, string listName); 
}
