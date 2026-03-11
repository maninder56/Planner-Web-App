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

    [StringLength(100)]
    public  required string Name { get; set; }

    [StringLength(200)]
    public required string Email { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool Guest { get; set; }

    [StringLength(255)]
    public required string PasswordHash { get; set; }

    // Foreign Key
    public int? LastBoardId { get; set; }    

    // Navigation properties
    public RefreshToken RefreshToken { get; set; } = null!;

    public List<BoardMember> BoardMembers { get; set;  } = [];

    public List<BoardStar> BoardStars { get; set; } = []; 
}
