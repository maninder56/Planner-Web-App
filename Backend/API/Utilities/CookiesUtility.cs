using API.Models.Account;
using API.Models.Cookies.Type;
using API.Services.Account;
using Microsoft.Extensions.Configuration;

namespace API.Utilities; 

public class CookiesUtility
{
    private TokenProviderUtility tokenUtility; 
    private IConfiguration configuration;

    public int GetAccessTokenLifeInMinutesDefaultValue() => 5;
    public int GetRefreshTokenLifeInDaysDefaultValue() => 3;
    

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

    public string? GetRefreshTokenFromHttpContext(HttpContext httpContext)
    {
        httpContext.Request.Cookies.TryGetValue(nameof(CookieType.refreshToken), out string? refreshToken);

        return refreshToken; 
    }

    public void SetNewTokensInsideCookies(HttpContext httpContext, Tokens tokens)
    {
        int accessTokenExpirationInMinutes = configuration.GetValue<int>("Jwt:ExpirationInMinutes", GetAccessTokenLifeInMinutesDefaultValue());
        int refreshTokenLifeTimeInDays = configuration.GetValue<int>("RefreshToken:ExpirationInDays", GetRefreshTokenLifeInDaysDefaultValue());

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

    public void UpdateTokensInsideCookies(HttpContext httpContext, Tokens tokens)
    {
        int accessTokenExpirationInMinutes = configuration.GetValue<int>("Jwt:ExpirationInMinutes", GetAccessTokenLifeInMinutesDefaultValue());
        int refreshTokenLifeTimeInDays = configuration.GetValue<int>("RefreshToken:ExpirationInDays", GetRefreshTokenLifeInDaysDefaultValue());

        CookieOptions cookieOptions = new CookieOptions { HttpOnly = true, IsEssential = true, Secure = true, SameSite = SameSiteMode.None };

        httpContext.Response.Cookies.Append(nameof(CookieType.accessToken), tokens.AccessToken,
            new CookieOptions(cookieOptions)
            {
                Expires = DateTime.UtcNow.AddMinutes(accessTokenExpirationInMinutes)
            });

        httpContext.Response.Cookies.Append(nameof(CookieType.refreshToken), tokens.RefreshToken,
            new CookieOptions(cookieOptions)
            {
                Expires = tokens.RefreshTokenExpiresAt ?? DateTime.UtcNow.AddDays(refreshTokenLifeTimeInDays)
            });
    }

    public void InvalidateCookies(HttpContext httpContext)
    {
        CookieOptions cookieOptions = new CookieOptions { HttpOnly = true, IsEssential = true, Secure = true, SameSite = SameSiteMode.None };

        httpContext.Response.Cookies.Append(nameof(CookieType.accessToken), "",
            new CookieOptions(cookieOptions)
            {
                Expires = DateTime.UtcNow.AddMinutes(-1)
            });

        httpContext.Response.Cookies.Append(nameof(CookieType.refreshToken), "",
            new CookieOptions(cookieOptions)
            {
                Expires = DateTime.UtcNow.AddDays(-1)
            });
    }
}
