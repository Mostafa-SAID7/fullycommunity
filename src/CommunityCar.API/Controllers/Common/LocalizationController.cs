using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Localization;

namespace CommunityCar.API.Controllers.Common;

[ApiController]
[Route("api/localization")]
[ApiExplorerSettings(GroupName = "pages")]
public class LocalizationController : ControllerBase
{
    private readonly ILocalizationService _localization;

    public LocalizationController(ILocalizationService localization) => _localization = localization;

    [HttpGet("languages")]
    public async Task<IActionResult> GetLanguages(CancellationToken ct)
    {
        var languages = await _localization.GetActiveLanguagesAsync(ct);
        return Ok(languages);
    }

    [HttpGet("translations/{languageCode}")]
    public async Task<IActionResult> GetTranslations(string languageCode, [FromQuery] TranslationCategory? category = null, CancellationToken ct = default)
    {
        if (category.HasValue)
        {
            var categoryTranslations = await _localization.GetCategoryAsync(category.Value, languageCode, ct);
            return Ok(categoryTranslations);
        }

        var translations = await _localization.ExportTranslationsAsync(languageCode, null, ct);
        return Ok(translations);
    }

    [HttpGet("translate/{key}")]
    public async Task<IActionResult> GetTranslation(string key, [FromQuery] string? lang = null, CancellationToken ct = default)
    {
        var value = lang != null 
            ? _localization.Get(key, lang) 
            : await _localization.GetAsync(key, ct);
        return Ok(new { key, value, language = lang ?? _localization.CurrentLanguage });
    }

    [HttpGet("current")]
    public IActionResult GetCurrentLanguage()
    {
        return Ok(new 
        { 
            language = _localization.CurrentLanguage, 
            isRtl = _localization.IsRtl 
        });
    }
}
