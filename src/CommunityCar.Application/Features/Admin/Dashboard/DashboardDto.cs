namespace CommunityCar.Application.Features.Admin.Dashboard;

public class AdminDashboardOverviewDto
{
    public UserStatistics Users { get; set; } = new();
    public ContentStatistics Content { get; set; } = new();
    public CommunityStatistics Community { get; set; } = new();
    public RevenueStatistics Revenue { get; set; } = new();
    public SystemHealth System { get; set; } = new();
}

public class UserStatistics
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int NewUsersToday { get; set; }
    public int NewUsersThisWeek { get; set; }
    public int NewUsersThisMonth { get; set; }
    public int PendingApprovals { get; set; }
    public Dictionary<string, int> UsersByRole { get; set; } = new();
}

public class ContentStatistics
{
    public int TotalPosts { get; set; }
    public int TotalQuestions { get; set; }
    public int TotalReviews { get; set; }
    public int TotalGuides { get; set; }
    public int TotalVideos { get; set; }
    public int TotalPodcasts { get; set; }
    public int PendingModeration { get; set; }
}

public class CommunityStatistics
{
    public int TotalGroups { get; set; }
    public int TotalEvents { get; set; }
    public int ActiveDiscussions { get; set; }
    public int TotalComments { get; set; }
}

public class RevenueStatistics
{
    public decimal TotalRevenue { get; set; }
    public decimal RevenueToday { get; set; }
    public decimal RevenueThisMonth { get; set; }
    public int TotalOrders { get; set; }
    public int PendingOrders { get; set; }
}

public class SystemHealth
{
    public string Status { get; set; } = "Healthy";
    public int DatabaseSize { get; set; }
    public int StorageUsed { get; set; }
    public double CpuUsage { get; set; }
    public double MemoryUsage { get; set; }
}

// Role-specific dashboards
public class ExpertDashboardDto
{
    public int TotalAnswers { get; set; }
    public int AcceptedAnswers { get; set; }
    public int HelpfulVotes { get; set; }
    public decimal Rating { get; set; }
    public int QuestionsAnsweredThisWeek { get; set; }
    public List<RecentQuestionDto> RecentQuestions { get; set; } = new();
}

public class ReviewerDashboardDto
{
    public int TotalReviews { get; set; }
    public int HelpfulVotes { get; set; }
    public decimal AverageRating { get; set; }
    public int ReviewsThisMonth { get; set; }
    public List<RecentReviewDto> RecentReviews { get; set; } = new();
}

public class ContentCreatorDashboardDto
{
    public int TotalContent { get; set; }
    public int TotalViews { get; set; }
    public int TotalLikes { get; set; }
    public int TotalComments { get; set; }
    public int FollowersCount { get; set; }
    public ContentBreakdown Breakdown { get; set; } = new();
    public List<RecentContentDto> RecentContent { get; set; } = new();
}

public class ContentBreakdown
{
    public int Posts { get; set; }
    public int Guides { get; set; }
    public int Videos { get; set; }
    public int Podcasts { get; set; }
}

public class RecentQuestionDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int AnswerCount { get; set; }
}

public class RecentReviewDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
    public int HelpfulCount { get; set; }
}

public class RecentContentDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
}
