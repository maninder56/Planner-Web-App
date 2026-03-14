using API.Validations;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Board.Requests; 

public class BoardInfoChangeRequest
{
    [StringLength(100)]
    public string? Name { get; set; }

    public bool? IsFavoriteBoard { get; set; }

    [StringLength(30)]
    [ColourValidation(AllowNull = true)]
    public string? BackgroundColour { get; set; }
}
