using CommunityCar.Domain.Entities.Localization;

namespace CommunityCar.Application.Common.Interfaces;

/// <summary>
/// Localization service for multi-language support
/// </summary>
public interface ILocalizationService
{
    // Current language
    string CurrentLanguage { get; }
    bool IsRtl { get; }
    
    // Get translations
    string Get(string key, params object[] args);
    string Get(string key, string languageCode, params object[] args);
    Task<string> GetAsync(string key, CancellationToken ct = default);
    
    // Get all translations for a category
    Task<Dictionary<string, string>> GetCategoryAsync(TranslationCategory category, string? languageCode = null, CancellationToken ct = default);
    
    // Entity translations
    Task<string?> GetEntityTranslationAsync(string entityType, Guid entityId, string propertyName, string? languageCode = null, CancellationToken ct = default);
    Task SetEntityTranslationAsync(string entityType, Guid entityId, string propertyName, string value, string languageCode, bool isAutoTranslated = false, CancellationToken ct = default);
    
    // Languages
    Task<List<Language>> GetActiveLanguagesAsync(CancellationToken ct = default);
    Task<Language?> GetDefaultLanguageAsync(CancellationToken ct = default);
    
    // Admin operations
    Task<Translation> SetTranslationAsync(string key, string value, string languageCode, TranslationCategory category, CancellationToken ct = default);
    Task ImportTranslationsAsync(string languageCode, Dictionary<string, string> translations, TranslationCategory category, CancellationToken ct = default);
    Task<Dictionary<string, string>> ExportTranslationsAsync(string languageCode, TranslationCategory? category = null, CancellationToken ct = default);
}
