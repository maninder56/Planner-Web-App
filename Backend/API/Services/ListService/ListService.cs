using API.DTOs.List.Requests;
using API.DTOs.List.Responses;
using API.Models.Result;
using API.Repositories.ListRepository;
using DatabaseContext;

namespace API.Services.ListService; 

public class ListService(ILogger<ListService> logger, IListRepository listRepository) : IListService
{
    public async Task<Result<NewListResponse>> CreateNewListAsync(int boardId, NewListRequest request)
    {
        try
        {
            BoardList newList = await listRepository.CreateNewBoardListAsync(boardId, request.Name);
            return Result<NewListResponse>.Success(new NewListResponse 
            { 
                Name = newList.Name, ListPosition = newList.ListPosition 
            }); 
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to add new list in board with Id: {BoardId}, Exception message: {ExceptionMessage}", 
                boardId, ex.Message);
            //return Result<NewListResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error"); 
            throw; 
        }
    }
}
