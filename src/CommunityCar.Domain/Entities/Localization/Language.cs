using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Localization;

/// <summary>
/// Supported languages in the system
/// </summary>
public class Language : BaseEntity
{
    public string Code { get; set; } = string.Empty; // en, ar, fr, de, etc.
    public string Name { get; set; } = string.Empty; // English, Arabic, French
    public string NativeName { get; set; } = string.Empty; // English, العربية, Français
    public string? FlagUrl { get; set; }
    public bool IsRtl { get; set; } // Right-to-left
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}

/// <summary>
/// Translation keys and values
/// </summary>
public class Translation : BaseEntity
{
    public string Key { get; set; } = string.Empty; // e.g., "common.welcome", "errors.notFound"
    public string LanguageCode { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Context { get; set; } // Additional context for translators
    public TranslationCategory Category { get; set; } = TranslationCategory.Common;
    public bool IsApproved { get; set; } = true;
}

/// <summary>
/// Translatable content for entities
/// </summary>
public class EntityTranslation : BaseEntity
{
    public string EntityType { get; set; } = string.Empty; // Post, Product, Category, etc.
    public Guid EntityId { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string PropertyName { get; set; } = string.Empty; // Title, Description, Content
    public string Value { get; set; } = string.Empty;
    public bool IsAutoTranslated { get; set; }
}

public enum TranslationCategory
{
    Common,
    Navigation,
    Forms,
    Errors,
    Validation,
    Notifications,
    Emails,
    Pages,
    Admin,
    Community,
    Marketplace,
    Services,
    Podcasts,
    Videos
}
