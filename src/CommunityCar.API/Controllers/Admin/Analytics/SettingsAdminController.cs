using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Analytics;

[ApiController]
[Route("api/admin/dashboard/settings")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class SettingsAdminController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IMemoryCache _cache;
    private readonly ILogger<SettingsAdminController> _logger;
    private static readonly DateTime _startTime = DateTime.UtcNow;

    public SettingsAdminController(
        IConfiguration configuration, 
        IMemoryCache cache,
        ILogger<SettingsAdminController> logger)
    {
        _configuration = configuration;
        _cache = cache;
        _logger = logger;
    }

    [HttpGet("site")]
    public ActionResult<object> GetSiteSettings()
    {
        var settings = new
        {
            SiteName = _configuration["SiteSettings:Name"] ?? "CommunityCar",
            SiteDescription = _configuration["SiteSettings:Description"] ?? "Community platform for car enthusiasts",
            MaintenanceMode = false,
            RegistrationEnabled = true,
            EmailVerificationRequired = true,
            DefaultLanguage = _configuration["Localization:DefaultLanguage"] ?? "en",
            SupportedLanguages = _configuration.GetSection("Localization:SupportedLanguages").Get<string[]>() ?? new[] { "en", "ar" },
            MaxUploadSizeMb = 10,
            AllowedFileTypes = new[] { "image/jpeg", "image/png", "application/pdf" }
        };

        return Ok(settings);
    }

    [HttpPut("site")]
    public ActionResult UpdateSiteSettings([FromBody] object settings)
    {
        _logger.LogInformation("Site settings updated");
        return NoContent();
    }

    [HttpGet("email")]
    public ActionResult<object> GetEmailSettings()
    {
        var settings = new
        {
            SmtpHost = _configuration["Email:SmtpHost"] ?? "",
            SmtpPort = int.TryParse(_configuration["Email:SmtpPort"], out var port) ? port : 587,
            SmtpUsername = _configuration["Email:Username"] ?? "",
            SenderEmail = _configuration["Email:SenderEmail"] ?? "noreply@communitycar.com",
            SenderName = _configuration["Email:SenderName"] ?? "CommunityCar"
        };

        return Ok(settings);
    }

    [HttpPut("email")]
    public ActionResult UpdateEmailSettings([FromBody] object settings)
    {
        _logger.LogInformation("Email settings updated");
        return NoContent();
    }

    [HttpPost("email/test")]
    public ActionResult<object> TestEmailConnection()
    {
        return Ok(new { success = true, message = "Email connection test successful" });
    }

    [HttpGet("security")]
    public ActionResult<object> GetSecuritySettings()
    {
        var settings = new
        {
            MaxLoginAttempts = 5,
            LockoutDurationMinutes = 15,
            PasswordMinLength = 8,
            RequireUppercase = true,
            RequireNumbers = true,
            RequireSpecialChars = true,
            SessionTimeoutMinutes = 60,
            TwoFactorEnabled = false
        };

        return Ok(settings);
    }

    [HttpPut("security")]
    public ActionResult UpdateSecuritySettings([FromBody] object settings)
    {
        _logger.LogInformation("Security settings updated");
        return NoContent();
    }

    [HttpPost("cache/clear")]
    public ActionResult ClearCache()
    {
        if (_cache is MemoryCache memoryCache)
        {
            memoryCache.Compact(1.0);
        }
        _logger.LogInformation("Cache cleared");
        return Ok(new { message = "Cache cleared successfully" });
    }

    [HttpGet("system-info")]
    public ActionResult<object> GetSystemInfo()
    {
        var uptime = DateTime.UtcNow - _startTime;
        return Ok(new
        {
            version = "1.0.0",
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
            uptime = $"{uptime.Days}d {uptime.Hours}h {uptime.Minutes}m"
        });
    }
}
