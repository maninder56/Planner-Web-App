using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext;

[Table("passwordresettokens")]
public class PasswordResetToken
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    public required string TokenHash { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UsedAt { get; set; }


    // Foreign key
    public int UserId { get; set; }
}
