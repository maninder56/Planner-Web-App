namespace API.Models.Account; 

public class Tokens
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiresAt { get; set; }
}
