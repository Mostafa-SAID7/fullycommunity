using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Infrastructure;
using CommunityCar.Domain.Entities.Localization;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace CommunityCar.Infrastructure.Services.Localization;

public class LocalizationService : ILocalizationService
{
    private readonly AppDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private const string CachePrefix = "loc_";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(1);

    public LocalizationService(AppDbContext context, IMemoryCache cache, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _cache = cache;
        _httpContextAccessor = httpContextAccessor;
    }

    public string CurrentLanguage => GetCurrentLanguage();
    public bool IsRtl => IsCurrentLanguageRtl();

    public string Get(string key, params object[] args)
    {
        var value = GetCachedTranslation(key, CurrentLanguage);
        return args.Length > 0 ? string.Format(value, args) : value;
    }

    public string Get(string key, string languageCode, params object[] args)
    {
        var value = GetCachedTranslation(key, languageCode);
        return args.Length > 0 ? string.Format(value, args) : value;
    }

    public async Task<string> GetAsync(string key, CancellationToken ct = default)
    {
        return await Task.FromResult(Get(key));
    }

    public async Task<Dictionary<string, string>> GetCategoryAsync(TranslationCategory category, string? languageCode = null, CancellationToken ct = default)
    {
        var lang = languageCode ?? CurrentLanguage;
        var cacheKey = $"{CachePrefix}cat_{category}_{lang}";

        if (_cache.TryGetValue(cacheKey, out Dictionary<string, string>? cached) && cached != null)
            return cached;

        var translations = await _context.Set<Translation>()
            .Where(t => t.Category == category && t.LanguageCode == lang && t.IsApproved)
            .ToDictionaryAsync(t => t.Key, t => t.Value, ct);

        _cache.Set(cacheKey, translations, CacheDuration);
        return translations;
    }

    public async Task<string?> GetEntityTranslationAsync(string entityType, Guid entityId, string propertyName, string? languageCode = null, CancellationToken ct = default)
    {
        var lang = languageCode ?? CurrentLanguage;
        return await _context.Set<EntityTranslation>()
            .Where(t => t.EntityType == entityType && t.EntityId == entityId && t.PropertyName == propertyName && t.LanguageCode == lang)
            .Select(t => t.Value)
            .FirstOrDefaultAsync(ct);
    }

    public async Task SetEntityTranslationAsync(string entityType, Guid entityId, string propertyName, string value, string languageCode, bool isAutoTranslated = false, CancellationToken ct = default)
    {
        var existing = await _context.Set<EntityTranslation>()
            .FirstOrDefaultAsync(t => t.EntityType == entityType && t.EntityId == entityId && t.PropertyName == propertyName && t.LanguageCode == languageCode, ct);

        if (existing != null)
        {
            existing.Value = value;
            existing.IsAutoTranslated = isAutoTranslated;
        }
        else
        {
            _context.Set<EntityTranslation>().Add(new EntityTranslation
            {
                EntityType = entityType,
                EntityId = entityId,
                PropertyName = propertyName,
                LanguageCode = languageCode,
                Value = value,
                IsAutoTranslated = isAutoTranslated
            });
        }
        await _context.SaveChangesAsync(ct);
    }

    public async Task<List<Language>> GetActiveLanguagesAsync(CancellationToken ct = default)
    {
        const string cacheKey = $"{CachePrefix}languages";
        if (_cache.TryGetValue(cacheKey, out List<Language>? cached) && cached != null)
            return cached;

        var languages = await _context.Set<Language>()
            .Where(l => l.IsActive)
            .OrderBy(l => l.SortOrder)
            .ToListAsync(ct);

        _cache.Set(cacheKey, languages, CacheDuration);
        return languages;
    }

    public async Task<Language?> GetDefaultLanguageAsync(CancellationToken ct = default)
    {
        return await _context.Set<Language>().FirstOrDefaultAsync(l => l.IsDefault && l.IsActive, ct);
    }


    public async Task<Translation> SetTranslationAsync(string key, string value, string languageCode, TranslationCategory category, CancellationToken ct = default)
    {
        var existing = await _context.Set<Translation>()
            .FirstOrDefaultAsync(t => t.Key == key && t.LanguageCode == languageCode, ct);

        if (existing != null)
        {
            existing.Value = value;
            existing.Category = category;
        }
        else
        {
            existing = new Translation
            {
                Key = key,
                Value = value,
                LanguageCode = languageCode,
                Category = category,
                IsApproved = true
            };
            _context.Set<Translation>().Add(existing);
        }

        await _context.SaveChangesAsync(ct);
        InvalidateCache(key, languageCode);
        return existing;
    }

    public async Task ImportTranslationsAsync(string languageCode, Dictionary<string, string> translations, TranslationCategory category, CancellationToken ct = default)
    {
        foreach (var (key, value) in translations)
        {
            await SetTranslationAsync(key, value, languageCode, category, ct);
        }
    }

    public async Task<Dictionary<string, string>> ExportTranslationsAsync(string languageCode, TranslationCategory? category = null, CancellationToken ct = default)
    {
        var query = _context.Set<Translation>().Where(t => t.LanguageCode == languageCode);
        if (category.HasValue)
            query = query.Where(t => t.Category == category.Value);

        return await query.ToDictionaryAsync(t => t.Key, t => t.Value, ct);
    }

    private string GetCurrentLanguage()
    {
        var request = _httpContextAccessor.HttpContext?.Request;
        
        // Check query string
        if (request?.Query.TryGetValue("lang", out var langQuery) == true && !string.IsNullOrEmpty(langQuery))
            return langQuery!;
        
        // Check header
        var acceptLanguage = request?.Headers.AcceptLanguage.FirstOrDefault();
        if (!string.IsNullOrEmpty(acceptLanguage))
        {
            var lang = acceptLanguage.Split(',').FirstOrDefault()?.Split('-').FirstOrDefault();
            if (!string.IsNullOrEmpty(lang))
                return lang;
        }
        
        return "en";
    }

    private bool IsCurrentLanguageRtl()
    {
        var rtlLanguages = new[] { "ar", "he", "fa", "ur" };
        return rtlLanguages.Contains(CurrentLanguage);
    }

    private string GetCachedTranslation(string key, string languageCode)
    {
        var cacheKey = $"{CachePrefix}{languageCode}_{key}";
        
        if (_cache.TryGetValue(cacheKey, out string? cached) && cached != null)
            return cached;

        var translation = _context.Set<Translation>()
            .FirstOrDefault(t => t.Key == key && t.LanguageCode == languageCode && t.IsApproved);

        var value = translation?.Value ?? key;
        _cache.Set(cacheKey, value, CacheDuration);
        return value;
    }

    private void InvalidateCache(string key, string languageCode)
    {
        _cache.Remove($"{CachePrefix}{languageCode}_{key}");
    }
}
