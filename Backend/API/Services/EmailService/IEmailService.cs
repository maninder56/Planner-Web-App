namespace API.Services.EmailService; 

public interface IEmailService
{
    public Task SendPasswordResetEmailAsync(string toEmail, string resetLink);
    public Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = false); 
}
