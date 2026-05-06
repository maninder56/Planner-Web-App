using API.Models.EmailSettings;
using Microsoft.Extensions.Options;
using System.Net.Mail;

namespace API.Services.EmailService; 

public class EmailService : IEmailService
{
    private ILogger<EmailService> logger; 
    private readonly EmailSettings emailSettings; 

    public EmailService(IOptions<EmailSettings> options, ILogger<EmailService> logger)
    {
        emailSettings = options.Value;
        this.logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = false)
    {
        //try
        //{
            var message = new MailMessage(emailSettings.SenderEmail, toEmail, subject, body)
            {
                IsBodyHtml = isHtml
            };

            using var client = new SmtpClient(emailSettings.SmtpServer, emailSettings.Port);

            await client.SendMailAsync(message);
        //}
        //catch (Exception ex) 
        //{
        //    logger.LogWarning("Failed to send email to {Email}, Exception message: {ExceptionMessage}", 
        //        toEmail, ex.Message);
        //}
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
    {
        var subject = "Reset Your Password";

        var body = $@"
            <p>You requested a password reset.</p>
            <p><a href='{resetLink}'>Click here to reset your password</a></p>
            <p>If you didn't request this, ignore this email.</p>
        ";

        await SendEmailAsync(toEmail, subject, body, true);
    }
}
