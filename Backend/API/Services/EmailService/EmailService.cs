using API.Models.EmailSettings;
using Microsoft.Extensions.Options;
using System.Net;
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
        var from = new MailAddress(emailSettings.SenderEmail, emailSettings.SenderName);
        var to = new MailAddress(toEmail); 
        var message = new MailMessage(from, to)
        {
            Subject = subject,
            Body = body, 
            IsBodyHtml = isHtml
        };

        using var client = new SmtpClient(emailSettings.SmtpServer, emailSettings.Port)
        {
            Credentials = new NetworkCredential(emailSettings.SenderEmail, emailSettings.SenderPassword),
            EnableSsl = true
        }; 

        await client.SendMailAsync(message);
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
    {
        var subject = "Reset Your Password";

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
