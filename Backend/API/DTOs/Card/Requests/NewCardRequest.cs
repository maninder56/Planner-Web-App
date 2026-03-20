using DatabaseContext.Types;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.DTOs.Card.Requests; 

public class NewCardRequest
{
    [Required]
    [StringLength(50)]
    public required string Title { get; set; }

    [StringLength(400)]
    public string? Description { get; set; }

    [Required]  
    public bool IsDone { get; set; }

    [Required]
    public DateOnly DueDate { get; set; }

    [Required]
    public Priority Priority { get; set; }
}
