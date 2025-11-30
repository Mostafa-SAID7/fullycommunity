namespace CommunityCar.Application.Common.Interfaces;

/// <summary>
/// Global search service for searching across all entities
/// </summary>
public interface ISearchService
{
    // Global search
    Task<GlobalSearchResult> SearchAsync(string query, SearchOptions? options = null, CancellationToken ct = default);
    
    // Type-specific search
    Task<SearchResult<T>> SearchAsync<T>(string query, SearchOptions? options = null, CancellationToken ct = default) where T : class;
    
    // Suggestions/Autocomplete
    Task<List<SearchSuggestion>> GetSuggestionsAsync(string query, int limit = 10, CancellationToken ct = default);
    
    // Trending/Popular
    Task<List<TrendingItem>> GetTrendingAsync(SearchCategory? category = null, int limit = 10, CancellationToken ct = default);
    
    // Recent searches (per user)
    Task<List<string>> GetRecentSearchesAsync(Guid userId, int limit = 10, CancellationToken ct = default);
    Task SaveSearchAsync(Guid userId, string query, CancellationToken ct = default);
    Task ClearRecentSearchesAsync(Guid userId, CancellationToken ct = default);
    
    // Indexing (for admin/background jobs)
    Task IndexEntityAsync<T>(T entity, CancellationToken ct = default) where T : class;
    Task RemoveFromIndexAsync<T>(Guid id, CancellationToken ct = default) where T : class;
    Task ReindexAllAsync(SearchCategory? category = null, CancellationToken ct = default);
}

public class GlobalSearchResult
{
    public List<SearchResultItem> Posts { get; set; } = [];
    public List<SearchResultItem> Products { get; set; } = [];
    public List<SearchResultItem> Users { get; set; } = [];
    public List<SearchResultItem> Groups { get; set; } = [];
    public List<SearchResultItem> Events { get; set; } = [];
    public List<SearchResultItem> Questions { get; set; } = [];
    public List<SearchResultItem> Guides { get; set; } = [];
    public List<SearchResultItem> Podcasts { get; set; } = [];
    public List<SearchResultItem> Videos { get; set; } = [];
    public List<SearchResultItem> Services { get; set; } = [];
    public int TotalCount { get; set; }
}

public class SearchResult<T>
{
    public List<T> Items { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public Dictionary<string, List<FacetValue>>? Facets { get; set; }
}

public class SearchResultItem
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? Url { get; set; }
    public double Score { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}

public class SearchSuggestion
{
    public string Text { get; set; } = string.Empty;
    public SearchCategory? Category { get; set; }
    public int Count { get; set; }
}

public class TrendingItem
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int TrendScore { get; set; }
}

public class FacetValue
{
    public string Value { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class SearchOptions
{
    public List<SearchCategory>? Categories { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = true;
    public Dictionary<string, string>? Filters { get; set; }
    public bool IncludeFacets { get; set; }
    public string? LanguageCode { get; set; }
}

public enum SearchCategory
{
    All,
    Posts,
    Products,
    Users,
    Groups,
    Events,
    Questions,
    Guides,
    Podcasts,
    Videos,
    Services,
    News,
    Pages
}
