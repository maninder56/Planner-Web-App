using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("workspace")]
public class Workspace
{
    [Key]
    public int WorkspaceId { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    [Column(TypeName = "date")]
    public DateOnly CreatedAt { get; set; }

    // Navigation properties 
    public List<WorkspaceMember> WorkspaceMembers { get; set; } = [];

    public List<Board> Boards { get; set; } = []; 
}
