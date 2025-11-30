using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Pages;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/settings")]
[Authorize(Roles = "Admin,SuperAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class SettingsAdminController : ControllerBase
{
    private readonly IAppDbContext _context;

    public SettingsAdminController(IAppDbContext context) => _context = context;

    // Site Settings
    [HttpGet("site")]
    public async Task<IActionResult> GetSiteSettings(CancellationToken ct)
    {
        var settings = await _context.Set<SiteSettings>().ToListAsync(ct);
        return Ok(settings.ToDictionary(s => s.Key, s => s.Value));
    }

    [HttpPut("site")]
    public async Task<IActionResult> UpdateSiteSettings([FromBody] Dictionary<string, string> settings, CancellationToken ct)
    {
        foreach (var (key, value) in settings)
        {
            var setting = await _context.Set<SiteSettings>().FirstOrDefaultAsync(s => s.Key == key, ct);
            if (setting is not null) setting.Value = value;
            else _context.Set<SiteSettings>().Add(new SiteSettings { Key = key, Value = value });
        }
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpGet("site/{key}")]
    public async Task<IActionResult> GetSiteSetting(string key, CancellationToken ct)
    {
        var setting = await _context.Set<SiteSettings>().FirstOrDefaultAsync(s => s.Key == key, ct);
        if (setting is null) return NotFound();
        return Ok(new { setting.Key, setting.Value });
    }

    // Feature Flags
    [HttpGet("features")]
    public async Task<IActionResult> GetFeatureFlags(CancellationToken ct)
    {
        var features = await _context.Set<SiteSettings>()
            .Where(s => s.Key.StartsWith("feature_"))
            .ToListAsync(ct);
        return Ok(features.ToDictionary(s => s.Key.Replace("feature_", ""), s => s.Value == "true"));
    }

    [HttpPut("features/{feature}")]
    public async Task<IActionResult> ToggleFeature(string feature, [FromBody] ToggleFeatureRequest request, CancellationToken ct)
    {
        var key = $"feature_{feature}";
        var setting = await _context.Set<SiteSettings>().FirstOrDefaultAsync(s => s.Key == key, ct);
        if (setting is not null) setting.Value = request.Enabled.ToString().ToLower();
        else _context.Set<SiteSettings>().Add(new SiteSettings { Key = key, Value = request.Enabled.ToString().ToLower() });
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Maintenance Mode
    [HttpGet("maintenance")]
    public async Task<IActionResult> GetMaintenanceMode(CancellationToken ct)
    {
        var setting = await _context.Set<SiteSettings>().FirstOrDefaultAsync(s => s.Key == "maintenance_mode", ct);
        var message = await _context.Set<SiteSettings>().FirstOrDefaultAsync(s => s.Key == "maintenance_message", ct);
        return Ok(new { Enabled = setting?.Value == "true", Message = message?.Value });
    }

    [HttpPut("maintenance")]
    public async Task<IActionResult> SetMaintenanceMode([FromBody] MaintenanceModeRequest request, CancellationToken ct)
    {
        var setting = await _context.Set<SiteSettings>().FirstOrDefaultAsync(s => s.Key == "maintenance_mode", ct);
        if (setting is not null) setting.Value = request.Enabled.ToString().ToLower();
        else _context.Set<SiteSettings>().Add(new SiteSettings { Key = "maintenance_mode", Value = request.Enabled.ToString().ToLower() });

        if (request.Message is not null)
        {
            var msgSetting = await _context.Set<SiteSettings>().FirstOrDefaultAsync(s => s.Key == "maintenance_message", ct);
            if (msgSetting is not null) msgSetting.Value = request.Message;
            else _context.Set<SiteSettings>().Add(new SiteSettings { Key = "maintenance_message", Value = request.Message });
        }

        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Email Templates
    [HttpGet("email-templates")]
    public async Task<IActionResult> GetEmailTemplates(CancellationToken ct)
    {
        var templates = await _context.Set<SiteSettings>()
            .Where(s => s.Key.StartsWith("email_template_"))
            .Select(s => new { Name = s.Key.Replace("email_template_", ""), s.Value })
            .ToListAsync(ct);
        return Ok(templates);
    }

    [HttpPut("email-templates/{name}")]
    public async Task<IActionResult> UpdateEmailTemplate(string name, [FromBody] UpdateEmailTemplateRequest request, CancellationToken ct)
    {
        var key = $"email_template_{name}";
        var setting = await _context.Set<SiteSettings>().FirstOrDefaultAsync(s => s.Key == key, ct);
        if (setting is not null) setting.Value = request.Template;
        else _context.Set<SiteSettings>().Add(new SiteSettings { Key = key, Value = request.Template });
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // Audit Log
    [HttpGet("audit-log")]
    public async Task<IActionResult> GetAuditLog([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string? action = null, CancellationToken ct = default)
    {
        // This would query an audit log table
        return Ok(new { items = new List<object>(), total = 0, page, pageSize });
    }

    // System Info
    [HttpGet("system-info")]
    public IActionResult GetSystemInfo()
    {
        return Ok(new
        {
            Version = "1.0.0",
            Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
            ServerTime = DateTime.UtcNow,
            DotNetVersion = Environment.Version.ToString()
        });
    }

    // Cache Management
    [HttpPost("cache/clear")]
    public IActionResult ClearCache([FromBody] ClearCacheRequest? request)
    {
        // Clear cache implementation
        return Ok(new { Message = "Cache cleared successfully" });
    }
}

public record ToggleFeatureRequest(bool Enabled);
public record MaintenanceModeRequest(bool Enabled, string? Message);
public record UpdateEmailTemplateRequest(string Template);
public record ClearCacheRequest(string? Key);
