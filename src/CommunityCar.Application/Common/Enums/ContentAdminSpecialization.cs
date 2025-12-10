namespace CommunityCar.Application.Common.Enums;

/// <summary>
/// Content admin specialization types
/// </summary>
public enum ContentAdminSpecialization
{
    /// <summary>
    /// Community content management (QA, News, Pages, etc.)
    /// </summary>
    Community = 0,
    
    /// <summary>
    /// Videos and live stream management
    /// </summary>
    Videos = 1,
    
    /// <summary>
    /// Podcasts management
    /// </summary>
    Podcasts = 2,
    
    /// <summary>
    /// All content types (full ContentAdmin)
    /// </summary>
    All = 99
}
