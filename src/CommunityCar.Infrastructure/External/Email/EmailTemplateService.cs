namespace CommunityCar.Infrastructure.External.Email;

public interface IEmailTemplateService
{
    Task<string> RenderTemplateAsync(string templateName, Dictionary<string, string> data);
}

public class EmailTemplateService : IEmailTemplateService
{
    private readonly Dictionary<string, string> _templates = new()
    {
        ["welcome"] = """
            <h1>Welcome to CommunityCar, {{name}}!</h1>
            <p>Thank you for joining our community.</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="{{verifyUrl}}">Verify Email</a>
            """,

        ["password-reset"] = """
            <h1>Password Reset Request</h1>
            <p>Hi {{name}},</p>
            <p>Click the link below to reset your password:</p>
            <a href="{{resetLink}}">Reset Password</a>
            <p>This link will expire in 24 hours.</p>
            """,

        ["login-alert"] = """
            <h1>New Login Detected</h1>
            <p>Hi {{name}},</p>
            <p>A new login was detected on your account:</p>
            <ul>
                <li>Device: {{device}}</li>
                <li>Location: {{location}}</li>
                <li>Time: {{time}}</li>
            </ul>
            <p>If this wasn't you, please secure your account immediately.</p>
            """,

        ["otp"] = """
            <h1>Your Verification Code</h1>
            <p>Your verification code is: <strong>{{code}}</strong></p>
            <p>This code will expire in {{expiry}} minutes.</p>
            """
    };

    public Task<string> RenderTemplateAsync(string templateName, Dictionary<string, string> data)
    {
        if (!_templates.TryGetValue(templateName, out var template))
            throw new KeyNotFoundException($"Template '{templateName}' not found");

        var rendered = template;
        foreach (var (key, value) in data)
        {
            rendered = rendered.Replace($"{{{{{key}}}}}", value);
        }

        return Task.FromResult(rendered);
    }
}
