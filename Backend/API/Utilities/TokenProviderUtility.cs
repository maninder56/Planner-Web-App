using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;


namespace API.Utilities; 

public class TokenProviderUtility
{
    private string secretKey;
    private int tokenExpirationInMinutes;
    private string tokenIssuer;
    private string tokenAudience;

    private const int accessTokenDefaultLifeInMinutes = 5;

    public TokenProviderUtility(IConfiguration configuration)
    {
        secretKey = configuration["JwtSecret"] ?? throw new InvalidOperationException("Failed to get JWT Secret from configuration");
        tokenExpirationInMinutes = configuration.GetValue<int>("Jwt:ExpirationInMinutes", accessTokenDefaultLifeInMinutes);
        tokenIssuer = configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Failed to get Token Issuer from configuration");
        tokenAudience = configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Failed to get Token Audience from configuration");
    }

    public string Create(int userId, string email)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));  
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email)
            ]),
            Expires = DateTime.UtcNow.AddMinutes(tokenExpirationInMinutes),
            SigningCredentials = credentials,
            Issuer = tokenIssuer,
            Audience = tokenAudience
        };

        var handler = new JsonWebTokenHandler(); 
        string token = handler.CreateToken(tokenDescriptor);
        return token;
    }


    public async Task<int?> GetUserIdFromAccessTokenAsync(string accessToken)
    {
        var tokenValidations = new TokenValidationParameters()
        {
            ValidAudience = tokenAudience,
            ValidIssuer = tokenIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),

            ValidateLifetime = false,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true
        };


        TokenValidationResult result = await new JsonWebTokenHandler()
            .ValidateTokenAsync(accessToken, tokenValidations);

        if (result.IsValid && result.Claims.TryGetValue("sub", out object? idObject))
        {
            if (idObject is not null && int.TryParse((string)idObject, out int id))
            {
                return id;
            }
        }

        return null;

    }


}
