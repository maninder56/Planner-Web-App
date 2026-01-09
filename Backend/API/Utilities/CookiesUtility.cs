using API.Models.Account;
using API.Models.Cookies.Type;
using API.Services.Account;
using Microsoft.Extensions.Configuration;

namespace API.Utilities; 

public class CookiesUtility
{
    private TokenProviderUtility tokenUtility; 
    private IConfiguration configuration;

    public int GetRefreshTokenLifeInDaysDefaultValue() => 3;
    public int GetAccessTokenLifeInMinutesDefaultValue() => 5;

    public CookiesUtility(TokenProviderUtility tokenUtility, IConfiguration configuration)
    {
        this.tokenUtility = tokenUtility;
        this.configuration = configuration;
    }

    public async Task<int?> GetUserIdFromHttpContextAsync(HttpContext httpContext)
    {
        httpContext.Request.Cookies.TryGetValue(nameof(CookieType.accessToken), out string? accessToken);    

        if (accessToken == null)
        {
            return null; 
        }

        return await tokenUtility.GetUserIdFromAccessTokenAsync(accessToken); 
    }

    public void SetTokensInsideCookies(HttpContext httpContext, Tokens tokens)
    {
        int accessTokenExpirationInMinutes = configuration.GetValue<int>("Jwt:ExpirationInMinutes", GetRefreshTokenLifeInDaysDefaultValue());
        int refreshTokenLifeTimeInDays = configuration.GetValue<int>("RefreshToken:ExpirationInDays", GetAccessTokenLifeInMinutesDefaultValue());

        CookieOptions cookieOptions = new CookieOptions { HttpOnly = true, IsEssential = true, Secure = true, SameSite = SameSiteMode.None };

        httpContext.Response.Cookies.Append(nameof(CookieType.accessToken), tokens.AccessToken, 
            new CookieOptions(cookieOptions) 
            { 
                Expires = DateTime.UtcNow.AddMinutes(accessTokenExpirationInMinutes)
            });

        httpContext.Response.Cookies.Append(nameof(CookieType.refreshToken), tokens.RefreshToken,
            new CookieOptions(cookieOptions)
            {
                Expires = DateTime.UtcNow.AddDays(refreshTokenLifeTimeInDays)
            }); 
    }
}
