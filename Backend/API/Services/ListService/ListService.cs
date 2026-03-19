using API.DTOs.List.Requests;
using API.DTOs.List.Responses;
using API.Exceptions;
using API.Models.Result;
using API.Repositories.ListRepository;
using DatabaseContext;

namespace API.Services.ListService; 

public class ListService(ILogger<ListService> logger, IListRepository listRepository) : IListService
{

    // Create operations

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
            return Result<NewListResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }


    // update operations

    public async Task<Result<ChangeListInfoResponse>> UpdateListInfo(int boardId, int listId, ChangeListInfoRequest request)
    {
        try
        {
            BoardList changedBoardList = await listRepository.UpdateBoardListAsync(boardId, listId, request);

            return Result<ChangeListInfoResponse>.Success(new ChangeListInfoResponse
            {
                Name = request.Name is not null ? changedBoardList.Name : null, 
            }); 
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning("Failed to update list info, list not found"); 
            return Result<ChangeListInfoResponse>.Failed(ErrorType.BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to update list info, Exception Message: {ExceptionMessage}", ex.Message); 
            return Result<ChangeListInfoResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }


    public async Task<Result> UpdateListOrderAsync(int boardId, ChangeListOrderRequest request)
    {
        try
        {
            if (!request.ListIdsInOrder.Any())
            {
                return Result.Failed(ErrorType.BadRequest, "list is empty"); 
            }

            if (request.ListIdsInOrder.Distinct().Count() != request.ListIdsInOrder.Count)
            {
                return Result.Failed(ErrorType.BadRequest, "Duplicate IDs are not allowed in list");
            }

            await listRepository.UpdateBoardListOrderAsync(boardId, request.ListIdsInOrder);

            return Result.Success();
        }
        catch (BadRequestException ex)
        {
            logger.LogWarning("Failed to re order list, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<ChangeListInfoResponse>.Failed(ErrorType.BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to re order list, Exception Message: {ExceptionMessage}", ex.Message);
            return Result<ChangeListInfoResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }





    // Delete operations

    public async Task<Result> DeleteList(int boardId, int listId)
    {
        try
        {
            await listRepository.DeleteListAsync(boardId, listId);
            return Result.Success(); 
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to delete list , Exception Message: {ExceptionMessage}", ex.Message);
            return Result<ChangeListInfoResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }
}
