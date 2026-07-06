using DatabaseContext.Types;
using System.ComponentModel.DataAnnotations;

namespace API.Models.Card; 

public class GuestCard
{
    public required string Title { get; set; }

    public string? Description { get; set; }

    public bool IsDone { get; set; }

    public int DueInDays { get; set; }

    public Priority Priority { get; set; }
}
