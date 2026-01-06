using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("cards")]
public class Card
{
    [Key]
    public int CardId { get; set; }

    [StringLength(50)]
    public string Title { get; set; } = null!;

    [StringLength(400)]
    public string? Description { get; set; }

    [Column(TypeName = "SMALLINT")]
    public int CardPosition { get; set; }

    // Foreign key 
    public int BoardListId { get; set; }

    // Navigation properties 
    public BoardList BoardList { get; set; } = null!; 
}
