namespace API.DTOs.Board.Responses;

public class UserRemovedFromBoardResponse
{
    public required int userId { get; set; }

    public required int BoardId { get; set; }

    public required string Email { get; set; }
}
