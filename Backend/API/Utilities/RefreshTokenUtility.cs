using Microsoft.AspNetCore.Authentication;
using System.Security.Cryptography;

namespace API.Utilities; 

public static class RefreshTokenUtility
{
    public static byte[] GenerateRefreshTokenAsByteArray()
    {
        byte[] randomNumber = new byte[32];
        using RandomNumberGenerator rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return randomNumber;
    }

    public static byte[] HashRefreshToken(byte[] refreshTokenAsByteArray)
    {
        return SHA256.HashData(refreshTokenAsByteArray);
    }

    public static bool VerifyBase64RefreshTokenHash(string base64hash, string base64Token)
    {
        byte[] hashBytes = Decode(base64hash);
        byte[] tokenHashBytes = HashRefreshToken(Decode(base64Token));
        return CryptographicOperations.FixedTimeEquals(hashBytes, tokenHashBytes);
    }

    public static string Encode(byte[] bytes) => Base64UrlTextEncoder.Encode(bytes);
    public static byte[] Decode(string base64) => Base64UrlTextEncoder.Decode(base64); 

}
