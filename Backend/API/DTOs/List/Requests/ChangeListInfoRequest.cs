using System.ComponentModel.DataAnnotations;

namespace API.DTOs.List.Requests; 

public class ChangeListInfoRequest
{
    [StringLength(30)]
    public string? Name { get; set; }

    //[Range(0, int.MaxValue, ErrorMessage = "Position must be greater than -1")]
    //public int? ListPosition { get; set; }
}
