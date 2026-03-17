using System.ComponentModel.DataAnnotations;

namespace API.DTOs.List.Requests; 

public class NewListRequest
{
    [Required]
    [StringLength(30)]
    public required string Name { get; set; }
}
