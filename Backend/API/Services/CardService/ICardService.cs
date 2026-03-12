using API.DTOs.Board.Responses;
using API.Models.Result;

namespace API.Services.CardService; 

public interface ICardService
{
    public Task<Result<SearchResponse>> SearchCardByKeyword(int userId, string keyword); 
}
