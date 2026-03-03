using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("colours")]
public class Colour
{
    [Key]
    [StringLength(30)]
    public required string Name { get; set; }

    [Required]
    [StringLength(10)]
    public required string HexValue { get; set; }
}
