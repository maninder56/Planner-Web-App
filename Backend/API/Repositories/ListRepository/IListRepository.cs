using API.DTOs.List.Requests;
using DatabaseContext;

namespace API.Repositories.ListRepository; 

public interface IListRepository
{
    public Task<BoardList> CreateNewBoardListAsync(int boardId, string listName);

    public Task<BoardList> UpdateBoardListAsync(int boardId, int listId, ChangeListInfoRequest request);

    public Task DeleteListAsync(int boardId, int listId);

    public Task UpdateBoardListOrderAsync(int boardId, List<int> listIdsInOrder); 
}
