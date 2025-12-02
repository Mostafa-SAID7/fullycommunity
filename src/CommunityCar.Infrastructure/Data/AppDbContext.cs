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
    public DbSet<CommunityCar.Domain.Entities.Community.Posts.PostCategory> PostCategories => Set<CommunityCar.Domain.Entities.Community.Posts.PostCategory>();
    public DbSet<CommunityCar.Domain.Entities.Community.Posts.PostMedia> PostMedia => Set<CommunityCar.Domain.Entities.Community.Posts.PostMedia>();
    public DbSet<CommunityCar.Domain.Entities.Community.Posts.PostTag> PostTags => Set<CommunityCar.Domain.Entities.Community.Posts.PostTag>();
    public DbSet<CommunityCar.Domain.Entities.Community.QA.Question> Questions => Set<CommunityCar.Domain.Entities.Community.QA.Question>();
    public DbSet<CommunityCar.Domain.Entities.Community.QA.Answer> Answers => Set<CommunityCar.Domain.Entities.Community.QA.Answer>();
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
        // SCHEMA & TABLE NAMING - Identity (ASP.NET Identity tables)
        // ═══════════════════════════════════════════════════════════════════════
        
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable("AspNetUsers");
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.Bio).HasMaxLength(500);
            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.ThemeColor).HasMaxLength(20);
            entity.Property(e => e.PreferredLanguage).HasMaxLength(10);
        });

        builder.Entity<ApplicationRole>(entity =>
        {
            entity.ToTable("AspNetRoles");
            entity.Property(e => e.Description).HasMaxLength(256);
            entity.Property(e => e.DisplayName).HasMaxLength(100);
        });
        
        // ASP.NET Identity default tables - use default dbo schema
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserClaim<Guid>>().ToTable("AspNetUserClaims");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserLogin<Guid>>().ToTable("AspNetUserLogins");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserToken<Guid>>().ToTable("AspNetUserTokens");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityRoleClaim<Guid>>().ToTable("AspNetRoleClaims");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserRole<Guid>>().ToTable("AspNetUserRoles");

        // Identity - Custom tables
        builder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("RefreshTokens");
            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<UserDevice>(entity =>
        {
            entity.ToTable("UserDevices");
            entity.HasIndex(e => new { e.UserId, e.DeviceId }).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Devices)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<UserLogin>(entity =>
        {
            entity.ToTable("UserLoginHistory");
            entity.HasOne(e => e.User)
                  .WithMany(u => u.LoginHistory)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ExternalLogin>(entity =>
        {
            entity.ToTable("ExternalLogins");
            entity.HasIndex(e => new { e.Provider, e.ProviderKey }).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany(u => u.ExternalLogins)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<OtpCode>(entity =>
        {
            entity.ToTable("OtpCodes", "identity");
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Permission>(entity =>
        {
            entity.ToTable("Permissions", "identity");
        });

        builder.Entity<RolePermission>(entity =>
        {
            entity.ToTable("RolePermissions", "identity");
            entity.HasKey(e => new { e.RoleId, e.PermissionId });
            entity.HasOne(e => e.Role)
                  .WithMany(r => r.Permissions)
                  .HasForeignKey(e => e.RoleId);
            entity.HasOne(e => e.Permission)
                  .WithMany(p => p.RolePermissions)
                  .HasForeignKey(e => e.PermissionId);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // SCHEMA & TABLE NAMING - Security
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLogs", "security");
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Timestamp);
            entity.Property(e => e.Action).HasMaxLength(100);
            entity.Property(e => e.EntityType).HasMaxLength(100);
        });

        builder.Entity<SecurityAlert>(entity =>
        {
            entity.ToTable("SecurityAlerts", "security");
            entity.HasOne(e => e.User)
                  .WithMany(u => u.SecurityAlerts)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<LoginAttempt>(entity =>
        {
            entity.ToTable("LoginAttempts", "security");
            entity.HasIndex(e => new { e.UserId, e.CreatedAt });
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<UserSession>(entity =>
        {
            entity.ToTable("UserSessions", "security");
            entity.HasIndex(e => e.SessionToken).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<UserActivity>(entity =>
        {
            entity.ToTable("UserActivities", "security");
            entity.HasIndex(e => new { e.UserId, e.CreatedAt });
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<TwoFactorBackupCode>(entity =>
        {
            entity.ToTable("TwoFactorBackupCodes", "security");
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<BlockedIp>(entity =>
        {
            entity.ToTable("BlockedIps", "security");
            entity.HasIndex(e => e.IpAddress).IsUnique();
        });

        // ═══════════════════════════════════════════════════════════════════════
        // SCHEMA & TABLE NAMING - Profiles
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<AdminProfile>(entity =>
        {
            entity.ToTable("AdminProfiles", "profiles");
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ExpertProfile>(entity =>
        {
            entity.ToTable("ExpertProfiles", "profiles");
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<AuthorProfile>(entity =>
        {
            entity.ToTable("AuthorProfiles", "profiles");
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ReviewerProfile>(entity =>
        {
            entity.ToTable("ReviewerProfiles", "profiles");
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<VendorProfile>(entity =>
        {
            entity.ToTable("VendorProfiles", "profiles");
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<MechanicProfile>(entity =>
        {
            entity.ToTable("MechanicProfiles", "profiles");
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<GarageOwnerProfile>(entity =>
        {
            entity.ToTable("GarageOwnerProfiles", "profiles");
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<InstructorProfile>(entity =>
        {
            entity.ToTable("InstructorProfiles", "profiles");
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<StudentProfile>(entity =>
        {
            entity.ToTable("StudentProfiles", "profiles");
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<AffiliateProfile>(entity =>
        {
            entity.ToTable("AffiliateProfiles", "profiles");
            entity.HasIndex(e => e.AffiliateCode).IsUnique();
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // COMMUNITY - Q&A
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Community.QA.Question>(entity =>
        {
            entity.HasOne(q => q.AcceptedAnswer)
                  .WithOne()
                  .HasForeignKey<CommunityCar.Domain.Entities.Community.QA.Question>(q => q.AcceptedAnswerId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(q => q.Answers)
                  .WithOne(a => a.Question)
                  .HasForeignKey(a => a.QuestionId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.QA.Answer>(entity =>
        {
            entity.HasOne(a => a.Author)
                  .WithMany()
                  .HasForeignKey(a => a.AuthorId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // VIDEOS - Channels
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Videos.Channels.ChannelSubscription>(entity =>
        {
            entity.HasOne(s => s.Channel)
                  .WithMany(c => c.Subscribers)
                  .HasForeignKey(s => s.ChannelId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // COMMUNITY - Events (fix cascade delete cycles)
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Community.Events.EventAttendee>(entity =>
        {
            entity.HasOne(e => e.Event)
                  .WithMany(ev => ev.Attendees)
                  .HasForeignKey(e => e.EventId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Events.EventComment>(entity =>
        {
            entity.HasOne(e => e.Event)
                  .WithMany(ev => ev.Comments)
                  .HasForeignKey(e => e.EventId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // COMMUNITY - Groups (fix cascade delete cycles)
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Community.Groups.GroupMember>(entity =>
        {
            entity.HasOne(m => m.Group)
                  .WithMany(g => g.Members)
                  .HasForeignKey(m => m.GroupId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // COMMUNITY - Guides (fix cascade delete cycles)
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Community.Guides.GuideComment>(entity =>
        {
            entity.HasOne(c => c.Guide)
                  .WithMany(g => g.Comments)
                  .HasForeignKey(c => c.GuideId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Guides.GuideRating>(entity =>
        {
            entity.HasOne(r => r.Guide)
                  .WithMany(g => g.Ratings)
                  .HasForeignKey(r => r.GuideId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // COMMUNITY - Posts (fix cascade delete cycles)
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Community.Posts.PostComment>(entity =>
        {
            entity.HasOne(c => c.Post)
                  .WithMany(p => p.Comments)
                  .HasForeignKey(c => c.PostId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Posts.CommentLike>(entity =>
        {
            entity.HasOne(l => l.Comment)
                  .WithMany(c => c.Likes)
                  .HasForeignKey(l => l.CommentId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Posts.PostLike>(entity =>
        {
            entity.ToTable("PostLikes", "community");
            entity.HasOne(l => l.Post)
                  .WithMany(p => p.Likes)
                  .HasForeignKey(l => l.PostId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(l => l.User)
                  .WithMany()
                  .HasForeignKey(l => l.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Posts.PostCategory>(entity =>
        {
            entity.ToTable("PostCategories", "community");
            entity.HasIndex(e => e.Slug).IsUnique();
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Posts.PostMedia>(entity =>
        {
            entity.ToTable("PostMedia", "community");
            entity.HasOne(m => m.Post)
                  .WithMany(p => p.Media)
                  .HasForeignKey(m => m.PostId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Posts.PostTag>(entity =>
        {
            entity.ToTable("PostTags", "community");
            entity.HasOne(t => t.Post)
                  .WithMany(p => p.Tags)
                  .HasForeignKey(t => t.PostId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // COMMUNITY - Reviews (fix cascade delete cycles)
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Community.Reviews.ReviewComment>(entity =>
        {
            entity.HasOne(c => c.Review)
                  .WithMany(r => r.Comments)
                  .HasForeignKey(c => c.ReviewId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // COMMUNITY - News
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Community.News.NewsArticle>(entity =>
        {
            entity.ToTable("NewsArticles", "community");
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasOne(e => e.Author)
                  .WithMany()
                  .HasForeignKey(e => e.AuthorId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(e => e.Category)
                  .WithMany()
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.News.NewsCategory>(entity =>
        {
            entity.ToTable("NewsCategories", "community");
            entity.HasIndex(e => e.Slug).IsUnique();
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.News.NewsTag>(entity =>
        {
            entity.ToTable("NewsTags", "community");
            entity.HasOne(t => t.Article)
                  .WithMany(a => a.Tags)
                  .HasForeignKey(t => t.ArticleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.News.NewsComment>(entity =>
        {
            entity.ToTable("NewsComments", "community");
            entity.HasOne(c => c.Article)
                  .WithMany(a => a.Comments)
                  .HasForeignKey(c => c.ArticleId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // COMMUNITY - Maps
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Community.Maps.MapLocation>(entity =>
        {
            entity.ToTable("MapLocations", "community");
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasOne(e => e.AddedBy)
                  .WithMany()
                  .HasForeignKey(e => e.AddedById)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Maps.LocationReview>(entity =>
        {
            entity.ToTable("LocationReviews", "community");
            entity.HasOne(r => r.Location)
                  .WithMany(l => l.Reviews)
                  .HasForeignKey(r => r.LocationId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(r => r.Author)
                  .WithMany()
                  .HasForeignKey(r => r.AuthorId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Maps.LocationCheckIn>(entity =>
        {
            entity.ToTable("LocationCheckIns", "community");
            entity.HasOne(c => c.Location)
                  .WithMany(l => l.CheckIns)
                  .HasForeignKey(c => c.LocationId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Maps.LocationFeature>(entity =>
        {
            entity.ToTable("LocationFeatures", "community");
            entity.HasOne(f => f.Location)
                  .WithMany(l => l.Features)
                  .HasForeignKey(f => f.LocationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Maps.LocationMedia>(entity =>
        {
            entity.ToTable("LocationMedia", "community");
            entity.HasOne(m => m.Location)
                  .WithMany(l => l.Media)
                  .HasForeignKey(m => m.LocationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // PODCASTS (fix cascade delete cycles)
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Podcasts.Engagement.PodcastSubscription>(entity =>
        {
            entity.HasOne(s => s.PodcastShow)
                  .WithMany(sh => sh.Subscriptions)
                  .HasForeignKey(s => s.PodcastShowId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Podcasts.Engagement.EpisodeComment>(entity =>
        {
            entity.HasOne(c => c.Episode)
                  .WithMany(e => e.Comments)
                  .HasForeignKey(c => c.EpisodeId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Podcasts.Engagement.EpisodeReaction>(entity =>
        {
            entity.HasOne(r => r.Episode)
                  .WithMany(e => e.Reactions)
                  .HasForeignKey(r => r.EpisodeId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // VIDEOS (fix cascade delete cycles)
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Videos.Engagement.VideoComment>(entity =>
        {
            entity.HasOne(c => c.Video)
                  .WithMany(v => v.Comments)
                  .HasForeignKey(c => c.VideoId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Videos.Engagement.VideoReaction>(entity =>
        {
            entity.HasOne(r => r.Video)
                  .WithMany(v => v.Reactions)
                  .HasForeignKey(r => r.VideoId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Videos.Engagement.VideoMention>(entity =>
        {
            entity.HasOne(m => m.Video)
                  .WithMany(v => v.Mentions)
                  .HasForeignKey(m => m.VideoId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Videos.Playlists.PlaylistItem>(entity =>
        {
            entity.HasOne(p => p.Video)
                  .WithMany()
                  .HasForeignKey(p => p.VideoId)
                  .OnDelete(DeleteBehavior.NoAction);
        });
    }
}
