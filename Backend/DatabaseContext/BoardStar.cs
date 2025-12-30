using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("boardstar")]
public class BoardStar
{
    [Key]
    public int UserId { get; set; }

    [Key]
    public int BoardId { get; set; }

    [Column(TypeName = "date")]
    public DateOnly CreatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!; 
    public Board Board { get; set; } = null!; 
}
