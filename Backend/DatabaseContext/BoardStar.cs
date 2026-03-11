using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("boardstar")]
[PrimaryKey(nameof(BoardId), nameof(UserId))]
public class BoardStar
{
    public int UserId { get; set; }
    public int BoardId { get; set; }

    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!; 
    public Board Board { get; set; } = null!; 
}
