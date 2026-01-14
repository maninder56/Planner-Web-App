using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("boards")]
public class Board
{
    [Key]
    public int BoardId { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(30)]
    public string BackgroundColour { get; set; } = null!;

    [Column(TypeName = "date")]
    public DateOnly CreatedAt { get; set; }

    // Navigation Properties 
    public List<BoardMembers> BoardMembers { get; set; } = null!;

    public User? User { get; set; }

    public List<BoardStar> BoardStars { get; set; } = [];

    public List<BoardList> Lists { get; set; } = []; 
}
