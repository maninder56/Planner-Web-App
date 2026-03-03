using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.DTOs.Board; 

public class BoardCardDTO
{
    public int CardId { get; init; }

    public required string Title { get; init; } 

    public string? Description { get; init; }

    public bool IsDone { get; init; }

    public required string Priority { get; init; }

    public DateOnly DueDate { get; init; }

    public int CardPosition { get; init; }
}
