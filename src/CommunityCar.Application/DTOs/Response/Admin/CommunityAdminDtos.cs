namespace CommunityCar.Application.DTOs.Response.Admin;

public record ContentStatsDto
{
    public int TotalPosts { get; init; }
    public int TotalReviews { get; init; }
    public int TotalGuides { get; init; }
    public int TotalQuestions { get; init; }
    public int TotalPodcasts { get; init; }
    public int PendingApproval { get; init; }
}

public record ContentListResponseDto
{
    public List<object> Items { get; init; } = new();
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages { get; init; }
}

public record ModerationStatsDto
{
    public int PendingReports { get; init; }
    public int ResolvedToday { get; init; }
    public int ResolvedThisWeek { get; init; }
    public int TotalReports { get; init; }
}

public record ModerationListResponseDto
{
    public List<object> Items { get; init; } = new();
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages { get; init; }
}

