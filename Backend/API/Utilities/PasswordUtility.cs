using Microsoft.AspNetCore.Identity;

namespace API.Utilities; 

public static class PasswordUtility
{
    private static PasswordHasher<string> passwordHasher = new PasswordHasher<string>();

    public static string HashPassword(string password)
    {
        return passwordHasher.HashPassword("", password); 
    }

    public static bool VerifyPassword(string hashedPassword, string providedPassword)
    {
        var result = passwordHasher.VerifyHashedPassword("", hashedPassword, providedPassword); 

        return 
            result == PasswordVerificationResult.Success || 
            result == PasswordVerificationResult.SuccessRehashNeeded;
    }

}
