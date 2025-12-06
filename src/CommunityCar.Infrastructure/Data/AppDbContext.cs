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

        builder.Entity<CommunityCar.Domain.Entities.Community.QA.QuestionCategory>(entity =>
        {
            entity.HasIndex(e => e.Slug).IsUnique();
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.QA.QuestionTag>(entity =>
        {
            entity.HasOne(t => t.Question)
                  .WithMany(q => q.Tags)
                  .HasForeignKey(t => t.QuestionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.QA.QuestionVote>(entity =>
        {
            entity.HasOne(v => v.Question)
                  .WithMany(q => q.Votes)
                  .HasForeignKey(v => v.QuestionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.QA.QuestionBookmark>(entity =>
        {
            entity.HasOne(b => b.Question)
                  .WithMany(q => q.Bookmarks)
                  .HasForeignKey(b => b.QuestionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // VIDEOS - Channels
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Videos.Channels.Channel>(entity =>
        {
            entity.HasOne(c => c.User)
                  .WithMany()
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Videos.Channels.ChannelSubscription>(entity =>
        {
            entity.HasOne(s => s.Channel)
                  .WithMany(c => c.Subscribers)
                  .HasForeignKey(s => s.ChannelId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(s => s.Subscriber)
                  .WithMany()
                  .HasForeignKey(s => s.SubscriberId)
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

        builder.Entity<CommunityCar.Domain.Entities.Community.Posts.Post>(entity =>
        {
            entity.ToTable("Posts", "community");
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasOne(p => p.Author)
                  .WithMany()
                  .HasForeignKey(p => p.AuthorId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(p => p.Category)
                  .WithMany()
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Posts.PostComment>(entity =>
        {
            entity.ToTable("PostComments", "community");
            entity.HasOne(c => c.Post)
                  .WithMany(p => p.Comments)
                  .HasForeignKey(c => c.PostId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(c => c.Author)
                  .WithMany()
                  .HasForeignKey(c => c.AuthorId)
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

        builder.Entity<CommunityCar.Domain.Entities.Community.Maps.LocationReviewMedia>(entity =>
        {
            entity.ToTable("LocationReviewMedia", "community");
            entity.HasOne(m => m.LocationReview)
                  .WithMany(r => r.Media)
                  .HasForeignKey(m => m.LocationReviewId)
                  .OnDelete(DeleteBehavior.Cascade);
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

        // ═══════════════════════════════════════════════════════════════════════
        // COMMUNITY - Pages
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Community.Pages.Page>(entity =>
        {
            entity.ToTable("Pages", "community");
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasOne(p => p.Owner)
                  .WithMany()
                  .HasForeignKey(p => p.OwnerId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Pages.PageFollower>(entity =>
        {
            entity.ToTable("PageFollowers", "community");
            entity.HasOne(f => f.Page)
                  .WithMany(p => p.Followers)
                  .HasForeignKey(f => f.PageId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(f => f.User)
                  .WithMany()
                  .HasForeignKey(f => f.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Pages.PageAdmin>(entity =>
        {
            entity.ToTable("PageAdmins", "community");
            entity.HasOne(a => a.Page)
                  .WithMany(p => p.Admins)
                  .HasForeignKey(a => a.PageId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(a => a.User)
                  .WithMany()
                  .HasForeignKey(a => a.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Community.Pages.PageReview>(entity =>
        {
            entity.ToTable("PageReviews", "community");
            entity.HasOne(r => r.Page)
                  .WithMany(p => p.Reviews)
                  .HasForeignKey(r => r.PageId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(r => r.User)
                  .WithMany()
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // HOME - Stories
        // ═══════════════════════════════════════════════════════════════════════

        builder.Entity<CommunityCar.Domain.Entities.Home.Story>(entity =>
        {
            entity.ToTable("Stories", "home");
            entity.HasOne(s => s.User)
                  .WithMany()
                  .HasForeignKey(s => s.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(s => s.Page)
                  .WithMany(p => p.Stories)
                  .HasForeignKey(s => s.PageId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<CommunityCar.Domain.Entities.Home.StoryView>(entity =>
        {
            entity.ToTable("StoryViews", "home");
            entity.HasOne(v => v.Story)
                  .WithMany(s => s.Views)
                  .HasForeignKey(v => v.StoryId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(v => v.User)
                  .WithMany()
                  .HasForeignKey(v => v.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Home.StoryLike>(entity =>
        {
            entity.ToTable("StoryLikes", "home");
            entity.HasOne(l => l.Story)
                  .WithMany(s => s.Likes)
                  .HasForeignKey(l => l.StoryId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(l => l.User)
                  .WithMany()
                  .HasForeignKey(l => l.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        builder.Entity<CommunityCar.Domain.Entities.Home.StoryReply>(entity =>
        {
            entity.ToTable("StoryReplies", "home");
            entity.HasOne(r => r.Story)
                  .WithMany(s => s.Replies)
                  .HasForeignKey(r => r.StoryId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(r => r.User)
                  .WithMany()
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });
    }
}
