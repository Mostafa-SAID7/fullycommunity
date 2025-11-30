using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Entities.Community.Groups;
using CommunityCar.Domain.Entities.Community.Events;
using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Entities.Community.Guides;
using CommunityCar.Domain.Entities.Marketplace.Products;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Videos.Content;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Search;

public class SearchService : ISearchService
{
    private readonly AppDbContext _context;

    public SearchService(AppDbContext context) => _context = context;

    public async Task<GlobalSearchResult> SearchAsync(string query, SearchOptions? options = null, CancellationToken ct = default)
    {
        options ??= new SearchOptions();
        var normalizedQuery = query.ToLowerInvariant().Trim();
        var result = new GlobalSearchResult();

        var categories = options.Categories ?? [SearchCategory.All];
        var shouldSearchAll = categories.Contains(SearchCategory.All);

        // Search Posts
        if (shouldSearchAll || categories.Contains(SearchCategory.Posts))
        {
            result.Posts = await SearchPostsAsync(normalizedQuery, options.PageSize, ct);
        }

        // Search Products
        if (shouldSearchAll || categories.Contains(SearchCategory.Products))
        {
            result.Products = await SearchProductsAsync(normalizedQuery, options.PageSize, ct);
        }

        // Search Users
        if (shouldSearchAll || categories.Contains(SearchCategory.Users))
        {
            result.Users = await SearchUsersAsync(normalizedQuery, options.PageSize, ct);
        }

        // Search Groups
        if (shouldSearchAll || categories.Contains(SearchCategory.Groups))
        {
            result.Groups = await SearchGroupsAsync(normalizedQuery, options.PageSize, ct);
        }

        // Search Events
        if (shouldSearchAll || categories.Contains(SearchCategory.Events))
        {
            result.Events = await SearchEventsAsync(normalizedQuery, options.PageSize, ct);
        }

        // Search Questions
        if (shouldSearchAll || categories.Contains(SearchCategory.Questions))
        {
            result.Questions = await SearchQuestionsAsync(normalizedQuery, options.PageSize, ct);
        }

        // Search Guides
        if (shouldSearchAll || categories.Contains(SearchCategory.Guides))
        {
            result.Guides = await SearchGuidesAsync(normalizedQuery, options.PageSize, ct);
        }

        // Search Podcasts
        if (shouldSearchAll || categories.Contains(SearchCategory.Podcasts))
        {
            result.Podcasts = await SearchPodcastsAsync(normalizedQuery, options.PageSize, ct);
        }

        // Search Videos
        if (shouldSearchAll || categories.Contains(SearchCategory.Videos))
        {
            result.Videos = await SearchVideosAsync(normalizedQuery, options.PageSize, ct);
        }

        result.TotalCount = result.Posts.Count + result.Products.Count + result.Users.Count +
                           result.Groups.Count + result.Events.Count + result.Questions.Count +
                           result.Guides.Count + result.Podcasts.Count + result.Videos.Count;

        return result;
    }

    public Task<SearchResult<T>> SearchAsync<T>(string query, SearchOptions? options = null, CancellationToken ct = default) where T : class
    {
        throw new NotImplementedException("Type-specific search requires Elasticsearch or similar");
    }

    public async Task<List<SearchSuggestion>> GetSuggestionsAsync(string query, int limit = 10, CancellationToken ct = default)
    {
        var normalizedQuery = query.ToLowerInvariant().Trim();
        var suggestions = new List<SearchSuggestion>();

        // Get suggestions from posts
        var postTitles = await _context.Set<Post>()
            .Where(p => p.Title.ToLower().Contains(normalizedQuery))
            .Select(p => p.Title)
            .Take(limit / 2)
            .ToListAsync(ct);

        suggestions.AddRange(postTitles.Select(t => new SearchSuggestion { Text = t, Category = SearchCategory.Posts }));

        // Get suggestions from products
        var productNames = await _context.Set<Product>()
            .Where(p => p.Title.ToLower().Contains(normalizedQuery))
            .Select(p => p.Title)
            .Take(limit / 2)
            .ToListAsync(ct);

        suggestions.AddRange(productNames.Select(n => new SearchSuggestion { Text = n, Category = SearchCategory.Products }));

        return suggestions.Take(limit).ToList();
    }

    public async Task<List<TrendingItem>> GetTrendingAsync(SearchCategory? category = null, int limit = 10, CancellationToken ct = default)
    {
        var trending = new List<TrendingItem>();

        // Get trending posts
        var posts = await _context.Set<Post>()
            .OrderByDescending(p => p.ViewCount + p.LikeCount * 2)
            .Take(limit)
            .Select(p => new TrendingItem { Id = p.Id, Type = "Post", Title = p.Title, TrendScore = p.ViewCount + p.LikeCount * 2 })
            .ToListAsync(ct);

        trending.AddRange(posts);
        return trending.OrderByDescending(t => t.TrendScore).Take(limit).ToList();
    }

    public Task<List<string>> GetRecentSearchesAsync(Guid userId, int limit = 10, CancellationToken ct = default)
    {
        // Would store in a SearchHistory table
        return Task.FromResult(new List<string>());
    }

    public Task SaveSearchAsync(Guid userId, string query, CancellationToken ct = default)
    {
        // Would save to SearchHistory table
        return Task.CompletedTask;
    }

    public Task ClearRecentSearchesAsync(Guid userId, CancellationToken ct = default)
    {
        // Would clear from SearchHistory table
        return Task.CompletedTask;
    }

    public Task IndexEntityAsync<T>(T entity, CancellationToken ct = default) where T : class
    {
        // Would index to Elasticsearch
        return Task.CompletedTask;
    }

    public Task RemoveFromIndexAsync<T>(Guid id, CancellationToken ct = default) where T : class
    {
        // Would remove from Elasticsearch
        return Task.CompletedTask;
    }

    public Task ReindexAllAsync(SearchCategory? category = null, CancellationToken ct = default)
    {
        // Would reindex all entities
        return Task.CompletedTask;
    }


    private async Task<List<SearchResultItem>> SearchPostsAsync(string query, int limit, CancellationToken ct)
    {
        return await _context.Set<Post>()
            .Where(p => p.Title.ToLower().Contains(query) || (p.Content != null && p.Content.ToLower().Contains(query)))
            .Take(limit)
            .Select(p => new SearchResultItem
            {
                Id = p.Id,
                Type = "Post",
                Title = p.Title,
                Description = p.Content != null ? p.Content.Substring(0, Math.Min(200, p.Content.Length)) : null,
                Score = 1.0
            })
            .ToListAsync(ct);
    }

    private async Task<List<SearchResultItem>> SearchProductsAsync(string query, int limit, CancellationToken ct)
    {
        return await _context.Set<Product>()
            .Where(p => p.Title.ToLower().Contains(query) || (p.Description != null && p.Description.ToLower().Contains(query)))
            .Take(limit)
            .Select(p => new SearchResultItem
            {
                Id = p.Id,
                Type = "Product",
                Title = p.Title,
                Description = p.Description != null ? p.Description.Substring(0, Math.Min(200, p.Description.Length)) : null,
                Score = 1.0
            })
            .ToListAsync(ct);
    }

    private async Task<List<SearchResultItem>> SearchUsersAsync(string query, int limit, CancellationToken ct)
    {
        return await _context.Set<ApplicationUser>()
            .Where(u => (u.UserName != null && u.UserName.ToLower().Contains(query)) || u.FirstName.ToLower().Contains(query) || u.LastName.ToLower().Contains(query))
            .Take(limit)
            .Select(u => new SearchResultItem
            {
                Id = u.Id,
                Type = "User",
                Title = u.UserName ?? $"{u.FirstName} {u.LastName}",
                ImageUrl = u.AvatarUrl,
                Score = 1.0
            })
            .ToListAsync(ct);
    }

    private async Task<List<SearchResultItem>> SearchGroupsAsync(string query, int limit, CancellationToken ct)
    {
        return await _context.Set<Group>()
            .Where(g => g.Name.ToLower().Contains(query) || (g.Description != null && g.Description.ToLower().Contains(query)))
            .Take(limit)
            .Select(g => new SearchResultItem
            {
                Id = g.Id,
                Type = "Group",
                Title = g.Name,
                Description = g.Description,
                ImageUrl = g.CoverImageUrl,
                Score = 1.0
            })
            .ToListAsync(ct);
    }

    private async Task<List<SearchResultItem>> SearchEventsAsync(string query, int limit, CancellationToken ct)
    {
        return await _context.Set<Event>()
            .Where(e => e.Title.ToLower().Contains(query) || e.Description.ToLower().Contains(query))
            .Take(limit)
            .Select(e => new SearchResultItem
            {
                Id = e.Id,
                Type = "Event",
                Title = e.Title,
                Description = e.Description.Substring(0, Math.Min(200, e.Description.Length)),
                ImageUrl = e.CoverImageUrl,
                Score = 1.0
            })
            .ToListAsync(ct);
    }

    private async Task<List<SearchResultItem>> SearchQuestionsAsync(string query, int limit, CancellationToken ct)
    {
        return await _context.Set<Question>()
            .Where(q => q.Title.ToLower().Contains(query) || q.Content.ToLower().Contains(query))
            .Take(limit)
            .Select(q => new SearchResultItem
            {
                Id = q.Id,
                Type = "Question",
                Title = q.Title,
                Description = q.Content.Substring(0, Math.Min(200, q.Content.Length)),
                Score = 1.0
            })
            .ToListAsync(ct);
    }

    private async Task<List<SearchResultItem>> SearchGuidesAsync(string query, int limit, CancellationToken ct)
    {
        return await _context.Set<Guide>()
            .Where(g => g.Title.ToLower().Contains(query) || (g.Description != null && g.Description.ToLower().Contains(query)))
            .Take(limit)
            .Select(g => new SearchResultItem
            {
                Id = g.Id,
                Type = "Guide",
                Title = g.Title,
                Description = g.Description,
                ImageUrl = g.CoverImageUrl,
                Score = 1.0
            })
            .ToListAsync(ct);
    }

    private async Task<List<SearchResultItem>> SearchPodcastsAsync(string query, int limit, CancellationToken ct)
    {
        return await _context.Set<PodcastShow>()
            .Where(p => p.Title.ToLower().Contains(query) || (p.Description != null && p.Description.ToLower().Contains(query)))
            .Take(limit)
            .Select(p => new SearchResultItem
            {
                Id = p.Id,
                Type = "Podcast",
                Title = p.Title,
                Description = p.Description,
                ImageUrl = p.CoverImageUrl,
                Score = 1.0
            })
            .ToListAsync(ct);
    }

    private async Task<List<SearchResultItem>> SearchVideosAsync(string query, int limit, CancellationToken ct)
    {
        return await _context.Set<Video>()
            .Where(v => v.Title.ToLower().Contains(query) || (v.Description != null && v.Description.ToLower().Contains(query)))
            .Take(limit)
            .Select(v => new SearchResultItem
            {
                Id = v.Id,
                Type = "Video",
                Title = v.Title,
                Description = v.Description,
                ImageUrl = v.ThumbnailUrl,
                Score = 1.0
            })
            .ToListAsync(ct);
    }
}
