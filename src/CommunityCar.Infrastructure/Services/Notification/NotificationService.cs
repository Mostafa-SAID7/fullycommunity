using Azure.Communication.Email;
using Azure.Communication.Sms;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Models = CommunityCar.Application.Common.Models;

namespace CommunityCar.Infrastructure.Services.Notification;

public class NotificationService : INotificationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<NotificationService> _logger;
    private readonly EmailClient? _emailClient;
    private readonly SmsClient? _smsClient;
    private readonly string _senderEmail;
    private readonly string _senderPhone;

    public NotificationService(IConfiguration configuration, ILogger<NotificationService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        var connectionString = _configuration["Azure:CommunicationServices:ConnectionString"];
        if (!string.IsNullOrEmpty(connectionString))
        {
            _emailClient = new EmailClient(connectionString);
            _smsClient = new SmsClient(connectionString);
        }

        _senderEmail = _configuration["Azure:CommunicationServices:SenderEmail"] ?? "noreply@communitycar.com";
        _senderPhone = _configuration["Azure:CommunicationServices:SenderPhone"] ?? "";
    }

    public async Task SendEmailAsync(Models.EmailMessage message)
    {
        if (_emailClient == null)
        {
            _logger.LogWarning("Email client not configured. Email to {To} not sent.", message.To);
            return;
        }

        try
        {
            var emailContent = new EmailContent(message.Subject);
            if (message.IsHtml)
                emailContent.Html = message.Body;
            else
                emailContent.PlainText = message.Body;

            var emailMessage = new Azure.Communication.Email.EmailMessage(
                senderAddress: message.From ?? _senderEmail,
                recipientAddress: message.To,
                content: emailContent);

            await _emailClient.SendAsync(Azure.WaitUntil.Completed, emailMessage);
            _logger.LogInformation("Email sent to {To}", message.To);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", message.To);
            throw;
        }
    }


    public async Task SendTemplatedEmailAsync(string templateId, string to, Dictionary<string, string> data)
    {
        var template = GetEmailTemplate(templateId, data);
        await SendEmailAsync(new Models.EmailMessage(to, template.Subject, template.Body, true));
    }

    public async Task SendSmsAsync(string phoneNumber, string message)
    {
        if (_smsClient == null || string.IsNullOrEmpty(_senderPhone))
        {
            _logger.LogWarning("SMS client not configured. SMS to {Phone} not sent.", phoneNumber);
            return;
        }

        try
        {
            await _smsClient.SendAsync(_senderPhone, phoneNumber, message);
            _logger.LogInformation("SMS sent to {Phone}", phoneNumber);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SMS to {Phone}", phoneNumber);
            throw;
        }
    }

    public async Task SendOtpSmsAsync(string phoneNumber, string otp)
    {
        await SendSmsAsync(phoneNumber, $"Your CommunityCar verification code is: {otp}. Valid for 5 minutes.");
    }

    public Task SendPushNotificationAsync(Guid userId, Models.PushNotification notification)
    {
        _logger.LogInformation("Push notification to user {UserId}: {Title}", userId, notification.Title);
        return Task.CompletedTask;
    }

    public Task SendPushToDeviceAsync(string pushToken, Models.PushNotification notification)
    {
        _logger.LogInformation("Push notification to device: {Title}", notification.Title);
        return Task.CompletedTask;
    }

    public async Task SendSecurityAlertAsync(Guid userId, Models.SecurityNotification notification)
    {
        _logger.LogWarning("Security alert for user {UserId}: {Title} - {Severity}", userId, notification.Title, notification.Severity);
        await Task.CompletedTask;
    }

    public async Task SendLoginAlertAsync(Guid userId, Models.LoginAlertInfo info)
    {
        await SendSecurityAlertAsync(userId, new Models.SecurityNotification(
            "New Login Detected",
            $"Login from {info.DeviceName} ({info.Browser}) at {info.Location}",
            "Medium",
            null));
    }

    public async Task SendPasswordChangedAlertAsync(Guid userId)
    {
        await SendSecurityAlertAsync(userId, new Models.SecurityNotification(
            "Password Changed",
            "Your password was recently changed. If you didn't make this change, please contact support.",
            "High",
            null));
    }

    public async Task SendNewDeviceAlertAsync(Guid userId, string deviceName, string location)
    {
        await SendSecurityAlertAsync(userId, new Models.SecurityNotification(
            "New Device Login",
            $"A new device ({deviceName}) logged into your account from {location}.",
            "Medium",
            null));
    }

    private static (string Subject, string Body) GetEmailTemplate(string templateId, Dictionary<string, string> data)
    {
        return templateId switch
        {
            "otp-verification" => (
                "Your Verification Code",
                $"<h2>Hello {data.GetValueOrDefault("name", "User")}!</h2><p>Your verification code is: <strong>{data["otp"]}</strong></p><p>This code expires in 5 minutes.</p>"
            ),
            "welcome" => (
                "Welcome to CommunityCar!",
                $"<h2>Welcome {data.GetValueOrDefault("name", "User")}!</h2><p>Thank you for joining CommunityCar.</p>"
            ),
            "password-reset" => (
                "Reset Your Password",
                $"<h2>Password Reset Request</h2><p>Click <a href='{data["resetLink"]}'>here</a> to reset your password.</p>"
            ),
            _ => ("Notification", "<p>You have a new notification from CommunityCar.</p>")
        };
    }
}
