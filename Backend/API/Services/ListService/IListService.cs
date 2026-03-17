using API.DTOs.List.Requests;
using API.DTOs.List.Responses;
using API.Models.Result;

namespace API.Services.ListService; 

public interface IListService
{
    public Task<Result<NewListResponse>> CreateNewListAsync(int boardId, NewListRequest request); 
}
