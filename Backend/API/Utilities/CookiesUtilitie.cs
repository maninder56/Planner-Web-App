using API.Models.Cookies.Type;

namespace API.Utilities; 

public class CookiesUtilitie
{
    private TokenProviderUtility tokenUtility; 

    public CookiesUtilitie(TokenProviderUtility tokenUtility)
    {
        this.tokenUtility = tokenUtility;
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
}
