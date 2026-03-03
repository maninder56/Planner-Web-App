using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.DTOs.Board; 

public class BoardCardDTO
{
    //id: z.number(),
    //title: z.string (), 
    //description: z.string (), 
    //done: z.boolean(), 
    //priority: CardPriority,
    //dueDate: z.date(), 
    //position: z.number(), 

    public string CardId { get; init; }

    public string Title { get; init; } 

    public string? Description { get; init; }

    public string Done { get; init; }

    public string Priority { get; init; }

    public string DueDate { get; init; }

    public int CardPosition { get; init; }
}
