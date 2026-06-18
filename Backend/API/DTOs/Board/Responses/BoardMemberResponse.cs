using DatabaseContext.Types;

namespace API.DTOs.Board.Responses; 

public class BoardMemberResponse
{
    public required int UserId { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }

    public required Role Role { get; set; }
}
