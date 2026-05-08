using DatabaseContext.Types;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Invitation.Requests; 

public class BoardInviteRequest
{
    [Required]
    public int BoardId { get; set; }

    [Required]
    [EmailAddress]
    public required string InvitedUserEmail { get; set; }

    [Required]
    public required Role Role { get; set; }
}
