using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Localization;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin;

[ApiController]
[Route("api/admin/localization")]
[Authorize(Roles = "Admin,SuperAdmin")]
[ApiExplorerSettings(GroupName = "admin")]
public class LocalizationAdminController : ControllerBase
{
    private readonly IAppDbContext _context;
    private readonly ILocalizationService _localization;

    public LocalizationAdminController(IAppDbContext context, ILocalizationService localization)
    {
        _context = context;
        _localization = localization;
    }

    // Languages
    [HttpGet("languages")]
    public async Task<IActionResult> GetLanguages(CancellationToken ct)
    {
        var languages = await _context.Set<Language>().OrderBy(l => l.SortOrder).ToListAsync(ct);
        return Ok(languages);
    }

    [HttpPost("languages")]
    public async Task<IActionResult> CreateLanguage([FromBody] CreateLanguageRequest request, CancellationToken ct)
    {
        var language = new Language
        {
            Code = request.Code,
            Name = request.Name,
            NativeName = request.NativeName,
            FlagUrl = request.FlagUrl,
            IsRtl = request.IsRtl,
            IsDefault = request.IsDefault,
            IsActive = true,
            SortOrder = request.SortOrder
        };

        if (request.IsDefault)
        {
            var existingDefault = await _context.Set<Language>().FirstOrDefaultAsync(l => l.IsDefault, ct);
            if (existingDefault != null) existingDefault.IsDefault = false;
        }

        _context.Set<Language>().Add(language);
        await _context.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetLanguages), new { id = language.Id }, language);
    }

    [HttpPut("languages/{id}")]
    public async Task<IActionResult> UpdateLanguage(Guid id, [FromBody] UpdateLanguageRequest request, CancellationToken ct)
    {
        var language = await _context.Set<Language>().FindAsync([id], ct);
        if (language == null) return NotFound();

        if (request.Name != null) language.Name = request.Name;
        if (request.NativeName != null) language.NativeName = request.NativeName;
        if (request.FlagUrl != null) language.FlagUrl = request.FlagUrl;
        if (request.IsRtl.HasValue) language.IsRtl = request.IsRtl.Value;
        if (request.IsActive.HasValue) language.IsActive = request.IsActive.Value;
        if (request.SortOrder.HasValue) language.SortOrder = request.SortOrder.Value;

        await _context.SaveChangesAsync(ct);
        return Ok(language);
    }

    // Translations
    [HttpGet("translations")]
    public async Task<IActionResult> GetTranslations(
        [FromQuery] string? languageCode = null,
        [FromQuery] TranslationCategory? category = null,
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
    {
        var query = _context.Set<Translation>().AsQueryable();

        if (!string.IsNullOrEmpty(languageCode))
            query = query.Where(t => t.LanguageCode == languageCode);
        if (category.HasValue)
            query = query.Where(t => t.Category == category.Value);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(t => t.Key.Contains(search) || t.Value.Contains(search));

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(t => t.Key)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return Ok(new { items, total, page, pageSize });
    }

    [HttpPost("translations")]
    public async Task<IActionResult> SetTranslation([FromBody] SetTranslationRequest request, CancellationToken ct)
    {
        var translation = await _localization.SetTranslationAsync(
            request.Key, request.Value, request.LanguageCode, request.Category, ct);
        return Ok(translation);
    }

    [HttpPost("translations/import")]
    public async Task<IActionResult> ImportTranslations([FromBody] ImportTranslationsRequest request, CancellationToken ct)
    {
        await _localization.ImportTranslationsAsync(request.LanguageCode, request.Translations, request.Category, ct);
        return Ok(new { message = $"Imported {request.Translations.Count} translations" });
    }

    [HttpGet("translations/export/{languageCode}")]
    public async Task<IActionResult> ExportTranslations(string languageCode, [FromQuery] TranslationCategory? category = null, CancellationToken ct = default)
    {
        var translations = await _localization.ExportTranslationsAsync(languageCode, category, ct);
        return Ok(translations);
    }

    [HttpDelete("translations/{id}")]
    public async Task<IActionResult> DeleteTranslation(Guid id, CancellationToken ct)
    {
        var translation = await _context.Set<Translation>().FindAsync([id], ct);
        if (translation == null) return NotFound();

        _context.Set<Translation>().Remove(translation);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }
}

public record CreateLanguageRequest(string Code, string Name, string NativeName, string? FlagUrl, bool IsRtl, bool IsDefault, int SortOrder);
public record UpdateLanguageRequest(string? Name, string? NativeName, string? FlagUrl, bool? IsRtl, bool? IsActive, int? SortOrder);
public record SetTranslationRequest(string Key, string Value, string LanguageCode, TranslationCategory Category);
public record ImportTranslationsRequest(string LanguageCode, Dictionary<string, string> Translations, TranslationCategory Category);
