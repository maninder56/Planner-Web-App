using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("boardlists")]
[Index(nameof(BoardId), nameof(ListPosition), IsUnique = true)]
public class BoardList
{
    [Key]
    public int BoardListId { get; set; }

    [StringLength(30)]
    public string Name { get; set; } = null!; 

    [Column(TypeName = "SMALLINT")]
    public int ListPosition { get; set; }

    // Foreign keys
    public int BoardId { get; set; }


    // Navigation properties 
    public Board Board { get; set; } = null!;

    public List<Card> Cards { get; set; } = [];

}
