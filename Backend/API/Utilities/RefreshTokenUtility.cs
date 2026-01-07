using Microsoft.AspNetCore.Authentication;
using System.Security.Cryptography;

namespace API.Utilities; 

public static class RefreshTokenUtility
{
    public static string GenerateRefreshTokenHashAsBase64()
    {
        byte[] randomNumber = new byte[32];
        using RandomNumberGenerator rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        byte[] hash = SHA256.HashData(randomNumber);
        return Base64UrlTextEncoder.Encode(hash);
    }


    public static bool VerifyBase64RefreshTokenHash(string base64hash, string providedbase64Hash)
    {
        byte[] hashBytes = Base64UrlTextEncoder.Decode(base64hash);
        byte[] providedHashBytes = Base64UrlTextEncoder.Decode(providedbase64Hash);
        return CryptographicOperations.FixedTimeEquals(hashBytes, providedHashBytes);
    }
}
