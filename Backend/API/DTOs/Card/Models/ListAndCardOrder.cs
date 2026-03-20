using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Card.Models; 

public class ListAndCardOrder
{
    [Required]
    public required int ListId { get; set; }

    [Required]
    public required List<int> CardIDsInOrder { get; set; }
}
