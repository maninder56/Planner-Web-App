namespace API.Models.Result; 

public record Error(ErrorType Type, string Title, string? Description = null); 