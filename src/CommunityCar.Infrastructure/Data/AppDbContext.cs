using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Profiles;
using CommunityCar.Domain.Entities.Localization;
using CommunityCar.Domain.Entities.Storage;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CommunityCar.Domain.Entities.Videos.Content;
using CommunityCar.Domain.Entities.Videos.Playlists;
using CommunityCar.Application.Common.Interfaces;

namespace CommunityCar.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Identity
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<UserDevice> UserDevices => Set<UserDevice>();
    public DbSet<UserLogin> UserLoginHistory => Set<UserLogin>();
    public DbSet<ExternalLogin> ExternalLogins => Set<ExternalLogin>();
    public DbSet<OtpCode> OtpCodes => Set<OtpCode>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    // Security & Audit
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<SecurityAlert> SecurityAlerts => Set<SecurityAlert>();
    public DbSet<LoginAttempt> LoginAttempts => Set<LoginAttempt>();
    public DbSet<UserSession> UserSessions => Set<UserSession>();
    public DbSet<UserActivity> UserActivities => Set<UserActivity>();
    public DbSet<TwoFactorBackupCode> TwoFactorBackupCodes => Set<TwoFactorBackupCode>();
    public DbSet<BlockedIp> BlockedIps => Set<BlockedIp>();

    // Profiles
    public DbSet<AdminProfile> AdminProfiles => Set<AdminProfile>();
    public DbSet<ExpertProfile> ExpertProfiles => Set<ExpertProfile>();
    public DbSet<AuthorProfile> AuthorProfiles => Set<AuthorProfile>();
    public DbSet<ReviewerProfile> ReviewerProfiles => Set<ReviewerProfile>();
    public DbSet<VendorProfile> VendorProfiles => Set<VendorProfile>();
    public DbSet<MechanicProfile> MechanicProfiles => Set<MechanicProfile>();
    public DbSet<GarageOwnerProfile> GarageOwnerProfiles => Set<GarageOwnerProfile>();
    public DbSet<InstructorProfile> InstructorProfiles => Set<InstructorProfile>();
    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();
    public DbSet<AffiliateProfile> AffiliateProfiles => Set<AffiliateProfile>();

    // Community
    public DbSet<CommunityCar.Domain.Entities.Community.Posts.Post> Posts => Set<CommunityCar.Domain.Entities.Community.Posts.Post>();
    public DbSet<CommunityCar.Domain.Entities.Community.Posts.PostComment> PostComments => Set<CommunityCar.Domain.Entities.Community.Posts.PostComment>();
    public DbSet<CommunityCar.Domain.Entities.Community.Posts.PostLike> PostLikes => Set<CommunityCar.Domain.Entities.Community.Posts.PostLike>();
    
    // Pages
    public DbSet<CommunityCar.Domain.Entities.Community.Pages.Page> Pages => Set<CommunityCar.Domain.Entities.Community.Pages.Page>();
    public DbSet<CommunityCar.Domain.Entities.Community.Pages.PageFollower> PageFollowers => Set<CommunityCar.Domain.Entities.Community.Pages.PageFollower>();
    public DbSet<CommunityCar.Domain.Entities.Community.Pages.PageAdmin> PageAdmins => Set<CommunityCar.Domain.Entities.Community.Pages.PageAdmin>();
    public DbSet<CommunityCar.Domain.Entities.Community.Pages.PageReview> PageReviews => Set<CommunityCar.Domain.Entities.Community.Pages.PageReview>();
    
    // Stories
    public DbSet<CommunityCar.Domain.Entities.Home.Story> Stories => Set<CommunityCar.Domain.Entities.Home.Story>();
    public DbSet<CommunityCar.Domain.Entities.Home.StoryView> StoryViews => Set<CommunityCar.Domain.Entities.Home.StoryView>();
    public DbSet<CommunityCar.Domain.Entities.Home.StoryLike> StoryLikes => Set<CommunityCar.Domain.Entities.Home.StoryLike>();
    public DbSet<CommunityCar.Domain.Entities.Home.StoryReply> StoryReplies => Set<CommunityCar.Domain.Entities.Home.StoryReply>();
    
    // Friendships
    public DbSet<CommunityCar.Domain.Entities.Community.Friendships.Friendship> Friendships => Set<CommunityCar.Domain.Entities.Community.Friendships.Friendship>();
    public DbSet<CommunityCar.Domain.Entities.Community.Friendships.UserFollow> UserFollows => Set<CommunityCar.Domain.Entities.Community.Friendships.UserFollow>();
    public DbSet<CommunityCar.Domain.Entities.Community.Friendships.UserBlock> UserBlocks => Set<CommunityCar.Domain.Entities.Community.Friendships.UserBlock>();
    public DbSet<CommunityCar.Domain.Entities.Community.Posts.PostCategory> PostCategories => Set<CommunityCar.Domain.Entities.Community.Posts.PostCategory>();
    public DbSet<CommunityCar.Domain.Entities.Community.Posts.PostMedia> PostMedia => Set<CommunityCar.Domain.Entities.Community.Posts.PostMedia>();
    public DbSet<CommunityCar.Domain.Entities.Community.Posts.PostTag> PostTags => Set<CommunityCar.Domain.Entities.Community.Posts.PostTag>();
    public DbSet<CommunityCar.Domain.Entities.Community.QA.Question> Questions => Set<CommunityCar.Domain.Entities.Community.QA.Question>();
    public DbSet<CommunityCar.Domain.Entities.Community.QA.Answer> Answers => Set<CommunityCar.Domain.Entities.Community.QA.Answer>();
    public DbSet<CommunityCar.Domain.Entities.Community.QA.QuestionCategory> QuestionCategories => Set<CommunityCar.Domain.Entities.Community.QA.QuestionCategory>();
    public DbSet<CommunityCar.Domain.Entities.Community.QA.QuestionTag> QuestionTags => Set<CommunityCar.Domain.Entities.Community.QA.QuestionTag>();
    public DbSet<CommunityCar.Domain.Entities.Community.QA.QuestionVote> QuestionVotes => Set<CommunityCar.Domain.Entities.Community.QA.QuestionVote>();
    public DbSet<CommunityCar.Domain.Entities.Community.QA.QuestionBookmark> QuestionBookmarks => Set<CommunityCar.Domain.Entities.Community.QA.QuestionBookmark>();
    public DbSet<CommunityCar.Domain.Entities.Community.Reviews.Review> Reviews => Set<CommunityCar.Domain.Entities.Community.Reviews.Review>();
    public DbSet<CommunityCar.Domain.Entities.Community.Guides.Guide> Guides => Set<CommunityCar.Domain.Entities.Community.Guides.Guide>();
    public DbSet<CommunityCar.Domain.Entities.Community.Guides.GuideStep> GuideSteps => Set<CommunityCar.Domain.Entities.Community.Guides.GuideStep>();
    public DbSet<CommunityCar.Domain.Entities.Community.Events.Event> Events => Set<CommunityCar.Domain.Entities.Community.Events.Event>();
    public DbSet<CommunityCar.Domain.Entities.Community.Groups.Group> Groups => Set<CommunityCar.Domain.Entities.Community.Groups.Group>();
    
    // News
    public DbSet<CommunityCar.Domain.Entities.Community.News.NewsArticle> NewsArticles => Set<CommunityCar.Domain.Entities.Community.News.NewsArticle>();
    public DbSet<CommunityCar.Domain.Entities.Community.News.NewsCategory> NewsCategories => Set<CommunityCar.Domain.Entities.Community.News.NewsCategory>();
    
    // Maps
    public DbSet<CommunityCar.Domain.Entities.Community.Maps.MapLocation> MapLocations => Set<CommunityCar.Domain.Entities.Community.Maps.MapLocation>();
    public DbSet<CommunityCar.Domain.Entities.Community.Maps.LocationReview> LocationReviews => Set<CommunityCar.Domain.Entities.Community.Maps.LocationReview>();

    // Videos
    public DbSet<Video> Videos => Set<Video>();
    public DbSet<Playlist> Playlists => Set<Playlist>();
    public DbSet<VideoCategory> VideoCategories => Set<VideoCategory>();
    public DbSet<CommunityCar.Domain.Entities.Videos.Channels.Channel> Channels => Set<CommunityCar.Domain.Entities.Videos.Channels.Channel>();
    public DbSet<CommunityCar.Domain.Entities.Videos.Channels.ChannelSubscription> ChannelSubscriptions => Set<CommunityCar.Domain.Entities.Videos.Channels.ChannelSubscription>();
    public DbSet<CommunityCar.Domain.Entities.Videos.Engagement.VideoComment> VideoComments => Set<CommunityCar.Domain.Entities.Videos.Engagement.VideoComment>();
    public DbSet<CommunityCar.Domain.Entities.Videos.Engagement.VideoReaction> VideoReactions => Set<CommunityCar.Domain.Entities.Videos.Engagement.VideoReaction>();
    public DbSet<CommunityCar.Domain.Entities.Videos.Engagement.SavedVideo> SavedVideos => Set<CommunityCar.Domain.Entities.Videos.Engagement.SavedVideo>();
    public DbSet<CommunityCar.Domain.Entities.Videos.Engagement.VideoShare> VideoShares => Set<CommunityCar.Domain.Entities.Videos.Engagement.VideoShare>();
    public DbSet<CommunityCar.Domain.Entities.Videos.Engagement.VideoView> VideoViews => Set<CommunityCar.Domain.Entities.Videos.Engagement.VideoView>();
    public DbSet<CommunityCar.Domain.Entities.Videos.Content.Sound> Sounds => Set<CommunityCar.Domain.Entities.Videos.Content.Sound>();
    public DbSet<CommunityCar.Domain.Entities.Videos.LiveStream.LiveStream> LiveStreams => Set<CommunityCar.Domain.Entities.Videos.LiveStream.LiveStream>();
    public DbSet<CommunityCar.Domain.Entities.Videos.LiveStream.LiveStreamChat> LiveStreamChats => Set<CommunityCar.Domain.Entities.Videos.LiveStream.LiveStreamChat>();

    // Podcasts
    public DbSet<CommunityCar.Domain.Entities.Podcasts.Shows.PodcastShow> PodcastShows => Set<CommunityCar.Domain.Entities.Podcasts.Shows.PodcastShow>();
    public DbSet<CommunityCar.Domain.Entities.Podcasts.Shows.PodcastEpisode> PodcastEpisodes => Set<CommunityCar.Domain.Entities.Podcasts.Shows.PodcastEpisode>();

    // Localization
    public DbSet<Language> Languages => Set<Language>();
    public DbSet<Translation> Translations => Set<Translation>();
    public DbSet<EntityTranslation> EntityTranslations => Set<EntityTranslation>();

    // Storage
    public DbSet<StoredFile> StoredFiles => Set<StoredFile>();

    // Notifications
    public DbSet<CommunityCar.Domain.Entities.Notifications.Notification> Notifications => Set<CommunityCar.Domain.Entities.Notifications.Notification>();

    // Moderation
    public DbSet<CommunityCar.Domain.Entities.Moderation.ContentReport> ContentReports => Set<CommunityCar.Domain.Entities.Moderation.ContentReport>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Apply all configurations from the assembly
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // ═══════════════════════════════════════════════════════════════════════
        // ASP.NET Identity Core Tables (use default dbo schema)
        // ═══════════════════════════════════════════════════════════════════════
        
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserClaim<Guid>>().ToTable("AspNetUserClaims");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserLogin<Guid>>().ToTable("AspNetUserLogins");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserToken<Guid>>().ToTable("AspNetUserTokens");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityRoleClaim<Guid>>().ToTable("AspNetRoleClaims");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserRole<Guid>>().ToTable("AspNetUserRoles");

    }
}
