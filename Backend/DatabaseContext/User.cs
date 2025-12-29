using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("users")]
[Index(nameof(Email), IsUnique = true)]
public class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [StringLength(100)]
    public  required string Name { get; set; }

    [Required]
    [StringLength(200)]
    public required string Email { get; set; }

    [Required]
    [Column(TypeName = "date")]
    public DateOnly CreatedAt { get; set; }

    public bool Guest { get; set; }

    [Required]
    [StringLength(255)]
    public required string PasswordHash { get; set; }

    // Foreign Key
    public int? LastBoardId { get; set; }    

    // Navigation properties
    public RefreshToken RefreshToken { get; set; } = null!;

    // workspace 
    // boardstars 
    // lastboard

}
