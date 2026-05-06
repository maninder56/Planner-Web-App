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

        //var body = $@"
        //    <p>You requested a password reset.</p>
        //    <p><a href='{resetLink}'>Click here to reset your password</a></p>
        //    <p>If you didn't request this, ignore this email.</p>
        //";

        var body = $@"
            <div style='font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px; text-align:center'>
                <div style='max-width:600px; margin:0px auto; background:white; padding: 60px; border-radius:8px;'>
                    <h2 style='color:#333;'>Password Reset Request</h2>
            
                    <p style='color:#555;'>You requested a password reset.</p>
            
                    <p>
                        <a href='{resetLink}' 
                            style='display:inline-block; padding:10px 20px; background-color:#007BFF; color:white; text-decoration:none; border-radius:5px;'>
                            Reset Your Password
                        </a>
                    </p>

                    <p style='color:#999; font-size:12px;'>
                        If you didn't request this, you can safely ignore this email.
                    </p>
                </div>
            </div>
            "; 

        await SendEmailAsync(toEmail, subject, body, true);
    }
}
