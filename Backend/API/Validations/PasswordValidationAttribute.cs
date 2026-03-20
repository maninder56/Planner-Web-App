using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace API.Validations;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
sealed public class PasswordValidationAttribute : ValidationAttribute
{
    Regex passwordRegex = new Regex(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$", RegexOptions.Compiled); 

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is string password && passwordRegex.IsMatch(password))
        {
            return ValidationResult.Success;
        }
        else
        {
            return new ValidationResult("Weak password not allowed. Password needs to have atleast one uppercase letter, one smallcase letter, at least one digit and at least 8 characters or more long"); 
        }
    }
}
