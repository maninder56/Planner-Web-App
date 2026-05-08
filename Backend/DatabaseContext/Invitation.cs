using DatabaseContext.Types;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("invitations")]
[Index(nameof(BoardId), nameof(InvitedUserEmail), IsUnique = true)]
public class Invitation
{
    [Key]
    public int Id { get; set; }

    public int BoardId { get; set; }

    public int InvitedByUserId { get; set; }

    public int InvitedUserId { get; set; }

    [EmailAddress]
    public required string InvitedUserEmail { get; set; }

    [Column(TypeName = "varchar(50)")]
    public Role Role { get; set; }

    [Column(TypeName = "varchar(50)")]
    public InvitationStatus Status { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? AcceptedAt { get; set; }


    // Navigation properties
    public Board Board { get; set; } = null!; 

    public User InvitedUser { get; set; } = null!;

    public User InvitedByUser { get; set; } = null!;

}
