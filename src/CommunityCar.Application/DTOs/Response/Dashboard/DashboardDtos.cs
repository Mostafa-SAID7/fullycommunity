namespace CommunityCar.Application.DTOs.Response.Dashboard;

public record ExpertDashboardDto
{
    public int TotalAnswers { get; init; }
    public int AcceptedAnswers { get; init; }
    public int HelpfulVotes { get; init; }
    public decimal Rating { get; init; }
    public int QuestionsAnsweredThisWeek { get; init; }
    public List<RecentQuestionDto> RecentQuestions { get; init; } = new();
}

public record RecentQuestionDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public int AnswerCount { get; init; }
}

public record ReviewerDashboardDto
{
    public int TotalReviews { get; init; }
    public int HelpfulVotes { get; init; }
    public decimal AverageRating { get; init; }
    public int ReviewsThisMonth { get; init; }
    public List<RecentReviewDto> RecentReviews { get; init; } = new();
}

public record RecentReviewDto
{
    public Guid Id { get; init; }
    public string? Title { get; init; }
    public decimal Rating { get; init; }
    public DateTime CreatedAt { get; init; }
    public int HelpfulCount { get; init; }
}

public record ContentCreatorDashboardDto
{
    public int TotalContent { get; init; }
    public int TotalViews { get; init; }
    public int TotalLikes { get; init; }
    public int TotalComments { get; init; }
    public int FollowersCount { get; init; }
    public ContentBreakdown Breakdown { get; init; } = new();
    public List<RecentContentDto> RecentContent { get; init; } = new();
}

public record ContentBreakdown
{
    public int Posts { get; init; }
    public int Guides { get; init; }
    public int Videos { get; init; }
    public int Podcasts { get; init; }
}

public record RecentContentDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public int ViewCount { get; init; }
    public int LikeCount { get; init; }
}

