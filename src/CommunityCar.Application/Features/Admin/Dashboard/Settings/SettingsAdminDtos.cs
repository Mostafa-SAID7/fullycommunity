namespace CommunityCar.Application.Features.Admin.Dashboard.Settings;

public record SiteSettingsDto
{
    public string SiteName { get; set; } = string.Empty;
    public string SiteDescription { get; set; } = string.Empty;
    public bool MaintenanceMode { get; set; }
    public bool RegistrationEnabled { get; set; }
    public bool EmailVerificationRequired { get; set; }
    public string DefaultLanguage { get; set; } = "en";
    public string[] SupportedLanguages { get; set; } = Array.Empty<string>();
    public int MaxUploadSizeMb { get; set; }
    public string[] AllowedFileTypes { get; set; } = Array.Empty<string>();
}

public record EmailSettingsDto
{
    public string SmtpHost { get; set; } = string.Empty;
    public int SmtpPort { get; set; }
    public string SmtpUsername { get; set; } = string.Empty;
    public string SenderEmail { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
}

public record SecuritySettingsDto
{
    public int MaxLoginAttempts { get; set; }
    public int LockoutDurationMinutes { get; set; }
    public int PasswordMinLength { get; set; }
    public bool RequireUppercase { get; set; }
    public bool RequireNumbers { get; set; }
    public bool RequireSpecialChars { get; set; }
    public int SessionTimeoutMinutes { get; set; }
    public bool TwoFactorEnabled { get; set; }
}
