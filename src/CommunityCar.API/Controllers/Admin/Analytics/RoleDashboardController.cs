using CommunityCar.Application.DTOs.Response.Dashboard;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Dashboard;

[ApiController]
[Route("api/dashboard")]
[Authorize]
[ApiExplorerSettings(GroupName = "mobile")]
public class RoleDashboardController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<RoleDashboardController> _logger;

    public RoleDashboardController(AppDbContext context, ILogger<RoleDashboardController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException());

    /// <summary>
    /// Get Expert dashboard statistics
    /// </summary>
    [HttpGet("expert")]
    [Authorize(Roles = "Expert")]
    public async Task<ActionResult<ExpertDashboardDto>> GetExpertDashboard()
    {
        try
        {
            var userId = GetUserId();
            var weekAgo = DateTime.UtcNow.AddDays(-7);

            var profile = await _context.ExpertProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            var dashboard = new ExpertDashboardDto
            {
                TotalAnswers = profile?.TotalAnswers ?? 0,
                AcceptedAnswers = await _context.Answers.CountAsync(a => a.AuthorId == userId && a.IsAccepted),
                HelpfulVotes = profile?.HelpfulVotes ?? 0,
                Rating = profile?.Rating ?? 0,
                QuestionsAnsweredThisWeek = await _context.Answers.CountAsync(a => a.AuthorId == userId && a.CreatedAt >= weekAgo),
                RecentQuestions = await _context.Questions
                    .Where(q => !q.IsDeleted)
                    .OrderByDescending(q => q.CreatedAt)
                    .Take(5)
                    .Select(q => new RecentQuestionDto
                    {
                        Id = q.Id,
                        Title = q.Title,
                        CreatedAt = q.CreatedAt,
                        AnswerCount = q.AnswerCount
                    })
                    .ToListAsync()
            };

            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert dashboard");
            return StatusCode(500, "Error retrieving dashboard data");
        }
    }

    /// <summary>
    /// Get Reviewer dashboard statistics
    /// </summary>
    [HttpGet("reviewer")]
    [Authorize(Roles = "Reviewer")]
    public async Task<ActionResult<ReviewerDashboardDto>> GetReviewerDashboard()
    {
        try
        {
            var userId = GetUserId();
            var monthAgo = DateTime.UtcNow.AddMonths(-1);

            var profile = await _context.ReviewerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            var dashboard = new ReviewerDashboardDto
            {
                TotalReviews = profile?.TotalReviews ?? 0,
                HelpfulVotes = profile?.HelpfulVotes ?? 0,
                AverageRating = profile?.AverageRating ?? 0,
                ReviewsThisMonth = await _context.Reviews.CountAsync(r => r.AuthorId == userId && r.CreatedAt >= monthAgo),
                RecentReviews = await _context.Reviews
                    .Where(r => r.AuthorId == userId && !r.IsDeleted)
                    .OrderByDescending(r => r.CreatedAt)
                    .Take(5)
                    .Select(r => new RecentReviewDto
                    {
                        Id = r.Id,
                        Title = r.Title,
                        Rating = r.OverallRating,
                        CreatedAt = r.CreatedAt,
                        HelpfulCount = r.HelpfulCount
                    })
                    .ToListAsync()
            };

            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting reviewer dashboard");
            return StatusCode(500, "Error retrieving dashboard data");
        }
    }

    /// <summary>
    /// Get Content Creator dashboard statistics
    /// </summary>
    [HttpGet("content-creator")]
    [Authorize(Roles = "Author")]
    public async Task<ActionResult<ContentCreatorDashboardDto>> GetContentCreatorDashboard()
    {
        try
        {
            var userId = GetUserId();

            var profile = await _context.AuthorProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            var posts = await _context.Posts.Where(p => p.AuthorId == userId && !p.IsDeleted).ToListAsync();
            var guides = await _context.Guides.Where(g => g.AuthorId == userId && !g.IsDeleted).ToListAsync();

            var dashboard = new ContentCreatorDashboardDto
            {
                TotalContent = profile?.TotalArticles ?? 0,
                TotalViews = profile?.TotalViews ?? 0,
                TotalLikes = profile?.TotalLikes ?? 0,
                TotalComments = posts.Sum(p => p.CommentCount),
                FollowersCount = profile?.FollowersCount ?? 0,
                Breakdown = new ContentBreakdown
                {
                    Posts = posts.Count,
                    Guides = guides.Count,
                    Videos = 0,
                    Podcasts = await _context.PodcastShows.CountAsync(p => p.OwnerId == userId && !p.IsDeleted)
                },
                RecentContent = posts
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(5)
                    .Select(p => new RecentContentDto
                    {
                        Id = p.Id,
                        Title = p.Title,
                        Type = "Post",
                        CreatedAt = p.CreatedAt,
                        ViewCount = p.ViewCount,
                        LikeCount = p.LikeCount
                    })
                    .ToList()
            };

            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting content creator dashboard");
            return StatusCode(500, "Error retrieving dashboard data");
        }
    }

    /// <summary>
    /// Get user's general dashboard overview
    /// </summary>
    [HttpGet("overview")]
    public async Task<ActionResult<object>> GetUserDashboard()
    {
        try
        {
            var userId = GetUserId();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            var overview = new
            {
                User = new
                {
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.AvatarUrl,
                    user.AccountStatus,
                    user.VerificationStatus
                },
                Activity = new
                {
                    PostsCreated = await _context.Posts.CountAsync(p => p.AuthorId == userId && !p.IsDeleted),
                    QuestionsAsked = await _context.Questions.CountAsync(q => q.AuthorId == userId && !q.IsDeleted),
                    ReviewsWritten = await _context.Reviews.CountAsync(r => r.AuthorId == userId && !r.IsDeleted),
                    CommentsPosted = await _context.PostComments.CountAsync(c => c.AuthorId == userId)
                },
                Engagement = new
                {
                    GroupsMembership = 0, // Implement when groups are ready
                    EventsAttending = 0,
                    FollowersCount = 0
                }
            };

            return Ok(overview);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user dashboard");
            return StatusCode(500, "Error retrieving dashboard data");
        }
    }
}
