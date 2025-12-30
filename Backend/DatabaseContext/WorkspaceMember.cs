using DatabaseContext.Types;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("workspacemembers")]
public class WorkspaceMember
{
    [Key]
    public int WorkspaceId { get; set; }

    [Key]
    public int UserId { get; set; }

    [StringLength(50)]
    public WorkspaceRole Role { get; set; }

    public DateTime JoinedAt { get; set; }


    // Navigation properties
    public Workspace Workspace { get; set; } = null!;
    public User User { get; set; } = null!;  
}
