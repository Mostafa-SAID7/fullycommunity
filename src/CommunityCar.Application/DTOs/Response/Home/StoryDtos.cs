namespace CommunityCar.Application.DTOs.Response.Home;

public record StoryDto
{
    public string Id { get; init; } = string.Empty;
    public string UserId { get; init; } = string.Empty;
    public string? PageId { get; init; }
    public string MediaUrl { get; init; } = string.Empty;
    public string? MediaType { get; init; }
    public string? Caption { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime ExpiresAt { get; init; }
    public bool IsActive { get; init; }
    public int ViewCount { get; init; }
}

public record StoryViewDto
{
    public string StoryId { get; init; } = string.Empty;
    public string UserId { get; init; } = string.Empty;
    public DateTime ViewedAt { get; init; }
}

