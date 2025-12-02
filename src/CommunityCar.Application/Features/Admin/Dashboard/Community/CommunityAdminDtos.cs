namespace CommunityCar.Application.Features.Admin.Dashboard.Community;

public record ContentStatsDto
{
    public int TotalPosts { get; set; }
    public int TotalReviews { get; set; }
    public int TotalGuides { get; set; }
    public int TotalQuestions { get; set; }
    public int TotalPodcasts { get; set; }
    public int PendingApproval { get; set; }
}

public record ContentItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string AuthorId { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int CommentCount { get; set; }
}

public record ContentListResponseDto
{
    public List<ContentItemDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}

public record RejectContentRequest
{
    public string Reason { get; set; } = string.Empty;
}

public record ModerationStatsDto
{
    public int PendingReports { get; set; }
    public int ResolvedToday { get; set; }
    public int ResolvedThisWeek { get; set; }
    public int TotalReports { get; set; }
}

public record ModerationItemDto
{
    public string Id { get; set; } = string.Empty;
    public string ContentId { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string ContentTitle { get; set; } = string.Empty;
    public string ReportReason { get; set; } = string.Empty;
    public string ReportedBy { get; set; } = string.Empty;
    public string ReportedAt { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = "normal";
    public string? ModeratorId { get; set; }
    public string? ModeratedAt { get; set; }
    public string? ModeratorNotes { get; set; }
}

public record ModerationListResponseDto
{
    public List<ModerationItemDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PendingCount { get; set; }
}

public record ModerationActionRequest
{
    public string? Notes { get; set; }
    public string? Reason { get; set; }
}
