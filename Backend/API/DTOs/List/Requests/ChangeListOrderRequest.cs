using System.ComponentModel.DataAnnotations;

namespace API.DTOs.List.Requests; 

public class ChangeListOrderRequest
{
    [Required]
    public required List<int> ListIdsInOrder { get; set; }
}


