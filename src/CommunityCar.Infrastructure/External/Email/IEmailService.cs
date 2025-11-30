namespace CommunityCar.Infrastructure.External.Email;

public interface IEmailService
{
    Task SendAsync(string to, string subject, string body, bool isHtml = true);
    Task SendWithAttachmentAsync(string to, string subject, string body, byte[] attachment, string attachmentName);
}
