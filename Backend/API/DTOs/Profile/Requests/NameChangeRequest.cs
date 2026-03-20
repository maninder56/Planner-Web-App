using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Profile.Requests; 

public class NameChangeRequest
{
    [Required]
    [StringLength(100)]
    public required string Name { get; set; }
}
