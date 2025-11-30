using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CommunityCar.Infrastructure.External.Email;

public class SmtpEmailService : IEmailService
{
    private readonly SmtpSettings _settings;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IOptions<SmtpSettings> settings, ILogger<SmtpEmailService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendAsync(string to, string subject, string body, bool isHtml = true)
    {
        try
        {
            using var client = CreateSmtpClient();
            using var message = new MailMessage(_settings.FromEmail, to, subject, body)
            {
                IsBodyHtml = isHtml
            };

            await client.SendMailAsync(message);
            _logger.LogInformation("Email sent to {To}", to);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
            throw;
        }
    }

    public async Task SendWithAttachmentAsync(string to, string subject, string body, byte[] attachment, string attachmentName)
    {
        try
        {
            using var client = CreateSmtpClient();
            using var message = new MailMessage(_settings.FromEmail, to, subject, body)
            {
                IsBodyHtml = true
            };

            using var stream = new MemoryStream(attachment);
            message.Attachments.Add(new Attachment(stream, attachmentName));

            await client.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email with attachment to {To}", to);
            throw;
        }
    }

    private SmtpClient CreateSmtpClient()
    {
        return new SmtpClient(_settings.Host, _settings.Port)
        {
            Credentials = new NetworkCredential(_settings.Username, _settings.Password),
            EnableSsl = _settings.EnableSsl
        };
    }
}

public class SmtpSettings
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
    public bool EnableSsl { get; set; } = true;
}
