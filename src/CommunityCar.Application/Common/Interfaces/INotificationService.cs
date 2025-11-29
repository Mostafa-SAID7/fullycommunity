namespace CommunityCar.Application.Common.Interfaces;

public interface INotificationService
{
    // Email
    Task SendEmailAsync(EmailMessage message);
    Task SendTemplatedEmailAsync(string templateId, string to, Dictionary<string, string> data);
    
    // SMS
    Task SendSmsAsync(string phoneNumber, string message);
    Task SendOtpSmsAsync(string phoneNumber, string otp);
    
    // Push Notifications
    Task SendPushNotificationAsync(Guid userId, PushNotification notification);
    Task SendPushToDeviceAsync(string pushToken, PushNotification notification);
    
    // Security Notifications
    Task SendSecurityAlertAsync(Guid userId, SecurityNotification notification);
    Task SendLoginAlertAsync(Guid userId, LoginAlertInfo info);
    Task SendPasswordChangedAlertAsync(Guid userId);
    Task SendNewDeviceAlertAsync(Guid userId, string deviceName, string location);
}

public record EmailMessage(
    string To,
    string Subject,
    string Body,
    bool IsHtml = true,
    string? From = null,
    IEnumerable<string>? Cc = null,
    IEnumerable<string>? Bcc = null,
    IEnumerable<EmailAttachment>? Attachments = null
);

public record EmailAttachment(
    string FileName,
    byte[] Content,
    string ContentType
);

public record PushNotification(
    string Title,
    string Body,
    string? ImageUrl = null,
    Dictionary<string, string>? Data = null,
    string? Action = null
);

public record SecurityNotification(
    string Title,
    string Message,
    string Severity,
    string? ActionUrl = null
);

public record LoginAlertInfo(
    string DeviceName,
    string Browser,
    string Location,
    string IpAddress,
    DateTime LoginTime
);
