using API.DTOs.List.Requests;
using API.DTOs.List.Responses;
using API.Models.Result;

namespace API.Services.ListService; 

public interface IListService
{
    public Task<Result<NewListResponse>> CreateNewListAsync(int boardId, NewListRequest request);

    public Task<Result<ChangeListInfoResponse>> UpdateListInfo(int boardId, int listId, ChangeListInfoRequest request);

    public Task<Result> UpdateListOrderAsync(int boardId, ChangeListOrderRequest request); 

    public Task<Result> DeleteList(int boardId, int listId); 
}
