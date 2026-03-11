using API.Validations;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Board.Requests; 

public class NewBoardRequest
{
    [Required]
    [StringLength(100)]
    public required string Name { get; set; }

    [Required]
    [StringLength(30)]
    [ColourValidation]
    public required string BackgroundColour { get; set; }
}
