using API.DTOs.Board.Responses;
using API.DTOs.Card.Responses;
using API.DTOs.List.Requests;
using API.DTOs.List.Responses;
using API.Exceptions;
using API.Models.Result;
using API.Queries.Lists;
using API.Repositories.ListRepository;
using API.SignalR.Hub;
using DatabaseContext;
using Microsoft.AspNetCore.SignalR;

namespace API.Services.ListService; 

public class ListService(
    ILogger<ListService> logger, 
    IListRepository listRepository,
    ListQueries listQueries,
    IHubContext<GlobalHub, IGlobalHubClient> globalHubContext) : IListService
{

    public async Task<Result<ListOrderResponse>> GetListOrderAsync(int boardId)
    {
        try
        {
            var listorder = await listQueries.GetListOrderAsync(boardId);
            return Result<ListOrderResponse>.Success(new ListOrderResponse() { ListOrder = listorder }); 
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to get list order of board with Id: {BoardId}, Exception message: {ExceptionMessage}",
                boardId, ex.Message);
            return Result<ListOrderResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }


    // Create operations

    public async Task<Result<NewListResponse>> CreateNewListAsync(int userID, int boardId, NewListRequest request)
    {
        try
        {
            BoardList newList = await listRepository.CreateNewBoardListAsync(boardId, request.Name);
            
            string groupName = $"board:{boardId}";
            await globalHubContext.Clients.Group(groupName).NewListAdded(new NewListAddedResponse
            {
                ByUserId = userID, ListId = newList.BoardListId, Name = newList.Name, ListPosition = newList.ListPosition, BoardId = boardId
            }); 
            
            return Result<NewListResponse>.Success(new NewListResponse 
            { 
                Id = newList.BoardListId, Name = newList.Name, ListPosition = newList.ListPosition 
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

    public async Task<Result<ChangeListInfoResponse>> UpdateListInfo(int userId, int boardId, int listId, ChangeListInfoRequest request)
    {
        try
        {
            BoardList changedBoardList = await listRepository.UpdateBoardListAsync(boardId, listId, request);
            
            string groupName = $"board:{boardId}";
            await globalHubContext.Clients.Group(groupName).ListNameUpdated(new ListNameUpdated
            {
                ByUserId = userId,
                ListId = listId, 
                NewName = changedBoardList.Name,
                BoardId = boardId,
            });


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


    public async Task<Result> UpdateListOrderAsync(int userId, int boardId, ChangeListOrderRequest request)
    {
        try
        {
            await listRepository.UpdateBoardListOrderAsync(boardId, request.ListIdsInOrder);

            string groupName = $"board:{boardId}";
            await globalHubContext.Clients.Group(groupName).ListPositionChanged(new UpdatedListOrderResponse
            {
                ByUserId = userId,
                BoardId = boardId,
                ListOrder = request.ListIdsInOrder,
            });

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

    public async Task<Result> DeleteList(int userId, int boardId, int listId)
    {
        try
        {
            await listRepository.DeleteListAsync(boardId, listId);

            string groupName = $"board:{boardId}";
            await globalHubContext.Clients.Group(groupName).ListHasBeenDeleted(new ListDeletedResponse
            {
                ByUserId = userId,
                ListId = listId,
                BoardId = boardId, 
            });

            return Result.Success(); 
        }
        catch (Exception ex)
        {
            logger.LogWarning("Failed to delete list , Exception Message: {ExceptionMessage}", ex.Message);
            return Result<ChangeListInfoResponse>.Failed(ErrorType.InternalServerError, "Unexpected Error");
        }
    }
}
