using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Board.Requests; 

public class LastUsedBoardChangeRequest
{
    [Required]
    public int LastUsedBoardId { get; set; }
}
