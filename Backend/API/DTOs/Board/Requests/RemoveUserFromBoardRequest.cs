using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Board.Requests; 

public class RemoveUserFromBoardRequest
{
    [Range(1, int.MaxValue)]
    public required int UserId { get; set; }
}
