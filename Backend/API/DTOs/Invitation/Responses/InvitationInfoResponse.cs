using DatabaseContext.Types;

namespace API.DTOs.Invitation.Responses; 

public class InvitationInfoResponse
{
    public required int Id { get; set; }

    public required int BoardId { get; set; }

    public required string BoardName { get; set; }

    public required string InvitedByUserEmail { get; set; }

    public required Role Role { get; set; }

    public required InvitationStatus Status { get; set; }

    public DateTime ExpiresAt { get; set; }
}
