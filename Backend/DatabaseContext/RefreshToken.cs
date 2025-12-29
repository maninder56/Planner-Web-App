using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DatabaseContext;

[Table("refreshtokens")]
[Index(nameof(UserId), IsUnique = true)]
[Index(nameof(TokenHash), IsUnique = true)]
public class RefreshToken
{
    [Key]
    public int RefreshTokenId { get; set; }

    [Required]
    [StringLength(100)]
    public required string TokenHash { get; set; }

    [Required]
    public DateTime ExpiresAt { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }


    // Foreign Key
    [Required]
    public int UserId { get; set; }


    // Navigation property
    public User User { get; set; } = null!; 
}
