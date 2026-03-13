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


    /// <summary>
    /// Converts a Base64-encoded refresh token to its Base64-encoded hash representation.
    /// </summary>
    /// <param name="refreshTokenInBase64">A refresh token encoded in Base64 format.</param>
    /// <returns>The Base64-encoded hash of the provided refresh token.</returns>
    public static string ConvertBase64ToBase64Hash(string refreshTokenInBase64)
    {
        var tokenBytes = Decode(refreshTokenInBase64);
        var hashBytes = HashRefreshToken(tokenBytes);
        var hashInBase64 = Encode(hashBytes);

        return hashInBase64; 
    }



    /// <summary>
    /// Converts refresh token bytes to Base64-encoded hash. 
    /// </summary>
    /// <param name="tokenBytes">The token bytes to hash and encode.</param>
    /// <returns>A Base64-encoded string representing the hash of the token bytes.</returns>
    public static string ConvertTokenBytesToBase64Hash(byte[] tokenBytes)
    {
        var hashBytes = HashRefreshToken(tokenBytes);
        var hashInBase64 = Encode(hashBytes);

        return hashInBase64;
    }

}
