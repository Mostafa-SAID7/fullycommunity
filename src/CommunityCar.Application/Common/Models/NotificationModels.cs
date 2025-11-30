namespace CommunityCar.Application.Common.Models;

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
