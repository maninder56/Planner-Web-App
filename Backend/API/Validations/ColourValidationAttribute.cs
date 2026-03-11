using System;
using System.ComponentModel.DataAnnotations;
using System.Net.NetworkInformation;

namespace API.Validations;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
sealed public class ColourValidationAttribute : ValidationAttribute
{
    private readonly string[] colours = { 
        "aqua", 
        "bright-pink", 
        "lavender-blue", 
        "light-mint-green", 
        "light-purple", 
        "soft-pink" 
    };

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is string colour && colours.Contains(colour))
        {
            return ValidationResult.Success;
        }
        else
        {
            return new ValidationResult($"Allowed values: {string.Join(", ", colours)}"); 
        }
    }

}
