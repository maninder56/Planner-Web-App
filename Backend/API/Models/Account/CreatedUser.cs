using DatabaseContext;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Account; 

public class CreatedUser
{
    public int UserId { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }
}
