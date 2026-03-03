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

[Table("boardmembers")]
[PrimaryKey(nameof(BoardId), nameof(UserId))]
public class BoardMembers
{
    public int BoardId { get; set; }
    public int UserId { get; set; }

    [Column(TypeName = "varchar(50)")]
    public Role Role { get; set; }

    public DateTime JoinedAt { get; set; }

    // Navigation properties
    public Board Board { get; set; } = null!;
    public User User { get; set; } = null!;  
}
