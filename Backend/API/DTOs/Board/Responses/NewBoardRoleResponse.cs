using DatabaseContext.Types;

namespace API.DTOs.Board.Responses; 

public class NewBoardRoleResponse
{
    public required int UserId { get; set; }

    public required string Email { get; set; }

    public required int BoardId { get; set; }

    public required Role NewRole { get; set; }
}
