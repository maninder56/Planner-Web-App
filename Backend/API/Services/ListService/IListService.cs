using API.DTOs.List.Requests;
using API.DTOs.List.Responses;
using API.Models.Result;

namespace API.Services.ListService; 

public interface IListService
{
    public Task<Result<ListOrderResponse>> GetListOrderAsync(int boardId); 

    public Task<Result<NewListResponse>> CreateNewListAsync(int userID, int boardId, NewListRequest request);

    public Task<Result<ChangeListInfoResponse>> UpdateListInfo(int userId, int boardId, int listId, ChangeListInfoRequest request);

    public Task<Result> UpdateListOrderAsync(int userId,int boardId, ChangeListOrderRequest request); 

    public Task<Result> DeleteList(int userId, int boardId, int listId); 
}
