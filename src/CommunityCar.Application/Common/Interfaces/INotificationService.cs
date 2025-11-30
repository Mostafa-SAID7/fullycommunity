using CommunityCar.Application.Common.Models;

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
