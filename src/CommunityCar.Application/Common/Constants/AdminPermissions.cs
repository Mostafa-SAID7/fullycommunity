namespace CommunityCar.Application.Common.Constants;

/// <summary>
/// Defines all admin permissions in the system
/// </summary>
public static class AdminPermissions
{
    // ===== SUPER ADMIN =====
    public const string All = "admin.all";
    
    // ===== SYSTEM MANAGEMENT =====
    public const string ManageUsers = "admin.users.manage";
    public const string ManageRoles = "admin.roles.manage";
    public const string ViewLogs = "admin.logs.view";
    public const string ManageSettings = "admin.settings.manage";
    
    // ===== CONTENT ADMIN - COMMUNITY =====
    public const string ContentCommunityView = "admin.content.community.view";
    public const string ContentCommunityCreate = "admin.content.community.create";
    public const string ContentCommunityEdit = "admin.content.community.edit";
    public const string ContentCommunityDelete = "admin.content.community.delete";
    public const string ContentCommunityModerate = "admin.content.community.moderate";
    
    // QA Management (part of community)
    public const string ContentCommunityQAView = "admin.content.community.qa.view";
    public const string ContentCommunityQAManage = "admin.content.community.qa.manage";
    public const string ContentCommunityQAModerate = "admin.content.community.qa.moderate";
    
    // News (part of community)
    public const string ContentCommunityNewsView = "admin.content.community.news.view";
    public const string ContentCommunityNewsManage = "admin.content.community.news.manage";
    
    // Pages (part of community)
    public const string ContentCommunityPagesView = "admin.content.community.pages.view";
    public const string ContentCommunityPagesManage = "admin.content.community.pages.manage";
    
    // ===== CONTENT ADMIN - VIDEOS =====
    public const string ContentVideosView = "admin.content.videos.view";
    public const string ContentVideosCreate = "admin.content.videos.create";
    public const string ContentVideosEdit = "admin.content.videos.edit";
    public const string ContentVideosDelete = "admin.content.videos.delete";
    public const string ContentVideosModerate = "admin.content.videos.moderate";
    public const string ContentLiveStreamManage = "admin.content.livestream.manage";
    
    // ===== CONTENT ADMIN - PODCASTS =====
    public const string ContentPodcastsView = "admin.content.podcasts.view";
    public const string ContentPodcastsCreate = "admin.content.podcasts.create";
    public const string ContentPodcastsEdit = "admin.content.podcasts.edit";
    public const string ContentPodcastsDelete = "admin.content.podcasts.delete";
    public const string ContentPodcastsModerate = "admin.content.podcasts.moderate";
    
    // ===== SERVICES ADMIN =====
    public const string ServicesView = "admin.services.view";
    public const string ServicesMaintenanceManage = "admin.services.maintenance.manage";
    public const string ServicesRoadsideManage = "admin.services.roadside.manage";
    public const string ServicesRepairManage = "admin.services.repair.manage";
    public const string ServicesDrivingSchoolManage = "admin.services.drivingschool.manage";
    public const string ServicesProvidersManage = "admin.services.providers.manage";
    
    // ===== MARKETPLACE ADMIN =====
    public const string MarketplaceView = "admin.marketplace.view";
    public const string MarketplaceListingsManage = "admin.marketplace.listings.manage";
    public const string MarketplaceCategoriesManage = "admin.marketplace.categories.manage";
    public const string MarketplaceOrdersView = "admin.marketplace.orders.view";
    public const string MarketplaceReportsHandle = "admin.marketplace.reports.handle";
    
    // ===== ANALYTICS & REPORTS =====
    public const string AnalyticsView = "admin.analytics.view";
    public const string ReportsGenerate = "admin.reports.generate";
    
    // ===== CMS (Static pages - separate from content) =====
    public const string CMSAboutManage = "admin.cms.about.manage";
    public const string CMSFAQManage = "admin.cms.faq.manage";
    public const string CMSLegalManage = "admin.cms.legal.manage";
    public const string CMSCareersManage = "admin.cms.careers.manage";
    
    /// <summary>
    /// Get all permissions for SuperAdmin
    /// </summary>
    public static List<string> GetSuperAdminPermissions()
    {
        return new List<string> { All };
    }
    
    /// <summary>
    /// Get all permissions for regular Admin
    /// </summary>
    public static List<string> GetAdminPermissions()
    {
        return new List<string>
        {
            ManageUsers,
            ViewLogs,
            AnalyticsView,
            ReportsGenerate,
            // Content viewing
            ContentCommunityView,
            ContentVideosView,
            ContentPodcastsView,
            ServicesView,
            MarketplaceView
        };
    }
    
    /// <summary>
    /// Get permissions for ContentAdmin with Community specialization
    /// </summary>
    public static List<string> GetContentAdminCommunityPermissions()
    {
        return new List<string>
        {
            ContentCommunityView,
            ContentCommunityCreate,
            ContentCommunityEdit,
            ContentCommunityDelete,
            ContentCommunityModerate,
            ContentCommunityQAView,
            ContentCommunityQAManage,
            ContentCommunityQAModerate,
            ContentCommunityNewsView,
            ContentCommunityNewsManage,
            ContentCommunityPagesView,
            ContentCommunityPagesManage,
            AnalyticsView
        };
    }
    
    /// <summary>
    /// Get permissions for ContentAdmin with Videos specialization
    /// </summary>
    public static List<string> GetContentAdminVideosPermissions()
    {
        return new List<string>
        {
            ContentVideosView,
            ContentVideosCreate,
            ContentVideosEdit,
            ContentVideosDelete,
            ContentVideosModerate,
            ContentLiveStreamManage,
            AnalyticsView
        };
    }
    
    /// <summary>
    /// Get permissions for ContentAdmin with Podcasts specialization
    /// </summary>
    public static List<string> GetContentAdminPodcastsPermissions()
    {
        return new List<string>
        {
            ContentPodcastsView,
            ContentPodcastsCreate,
            ContentPodcastsEdit,
            ContentPodcastsDelete,
            ContentPodcastsModerate,
            AnalyticsView
        };
    }
    
    /// <summary>
    /// Get permissions for ServicesAdmin
    /// </summary>
    public static List<string> GetServicesAdminPermissions()
    {
        return new List<string>
        {
            ServicesView,
            ServicesMaintenanceManage,
            ServicesRoadsideManage,
            ServicesRepairManage,
            ServicesDrivingSchoolManage,
            ServicesProvidersManage,
            AnalyticsView
        };
    }
    
    /// <summary>
    /// Get permissions for MarketplaceAdmin
    /// </summary>
    public static List<string> GetMarketplaceAdminPermissions()
    {
        return new List<string>
        {
            MarketplaceView,
            MarketplaceListingsManage,
            MarketplaceCategoriesManage,
            MarketplaceOrdersView,
            MarketplaceReportsHandle,
            AnalyticsView
        };
    }
    
    /// <summary>
    /// Get permissions for CMSAdmin (static content only)
    /// </summary>
    public static List<string> GetCMSAdminPermissions()
    {
        return new List<string>
        {
            // Static CMS pages only - NOT Community (QA/News/Pages), Videos, Podcasts, Services, Marketplace
            CMSAboutManage,
            CMSFAQManage,
            CMSLegalManage,
            CMSCareersManage,
            AnalyticsView
        };
    }
}
