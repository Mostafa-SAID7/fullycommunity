namespace CommunityCar.Domain.Constants;

/// <summary>
/// Centralized admin permission constants for role-based and permission-based authorization
/// </summary>
public static class AdminPermissions
{
    // ═══════════════════════════════════════════════════════════════════════════
    // USER MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string UsersView = "users.view";
    public const string UsersCreate = "users.create";
    public const string UsersEdit = "users.edit";
    public const string UsersDelete = "users.delete";
    public const string UsersExport = "users.export";
    public const string UsersImpersonate = "users.impersonate";

    // ═══════════════════════════════════════════════════════════════════════════
    // ROLE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string RolesView = "roles.view";
    public const string RolesCreate = "roles.create";
    public const string RolesEdit = "roles.edit";
    public const string RolesDelete = "roles.delete";
    public const string RolesAssign = "roles.assign";

    // ═══════════════════════════════════════════════════════════════════════════
    // PERMISSION MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string PermissionsView = "permissions.view";
    public const string PermissionsCreate = "permissions.create";
    public const string PermissionsEdit = "permissions.edit";
    public const string PermissionsDelete = "permissions.delete";
    public const string PermissionsAssign = "permissions.assign";

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTENT MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string ContentView = "content.view";
    public const string ContentCreate = "content.create";
    public const string ContentEdit = "content.edit";
    public const string ContentDelete = "content.delete";
    public const string ContentPublish = "content.publish";

    public const string PagesView = "pages.view";
    public const string PagesCreate = "pages.create";
    public const string PagesEdit = "pages.edit";
    public const string PagesDelete = "pages.delete";

    public const string FaqView = "faq.view";
    public const string FaqCreate = "faq.create";
    public const string FaqEdit = "faq.edit";
    public const string FaqDelete = "faq.delete";

    public const string LegalView = "legal.view";
    public const string LegalEdit = "legal.edit";

    // ═══════════════════════════════════════════════════════════════════════════
    // COMMUNITY MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string CommunityView = "community.view";
    public const string CommunityModerate = "community.moderate";

    public const string PostsView = "posts.view";
    public const string PostsEdit = "posts.edit";
    public const string PostsDelete = "posts.delete";
    public const string PostsFeature = "posts.feature";

    public const string CommentsView = "comments.view";
    public const string CommentsModerate = "comments.moderate";
    public const string CommentsDelete = "comments.delete";

    public const string ReportsView = "reports.view";
    public const string ReportsResolve = "reports.resolve";

    // ═══════════════════════════════════════════════════════════════════════════
    // MARKETPLACE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string MarketplaceView = "marketplace.view";
    public const string MarketplaceManage = "marketplace.manage";

    public const string ProductsView = "products.view";
    public const string ProductsCreate = "products.create";
    public const string ProductsEdit = "products.edit";
    public const string ProductsDelete = "products.delete";
    public const string ProductsApprove = "products.approve";

    public const string OrdersView = "orders.view";
    public const string OrdersEdit = "orders.edit";
    public const string OrdersRefund = "orders.refund";
    public const string OrdersCancel = "orders.cancel";

    public const string VendorsView = "vendors.view";
    public const string VendorsApprove = "vendors.approve";
    public const string VendorsManage = "vendors.manage";

    // ═══════════════════════════════════════════════════════════════════════════
    // VIDEO MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string VideosView = "videos.view";
    public const string VideosCreate = "videos.create";
    public const string VideosEdit = "videos.edit";
    public const string VideosDelete = "videos.delete";
    public const string VideosPublish = "videos.publish";

    public const string PlaylistsView = "playlists.view";
    public const string PlaylistsCreate = "playlists.create";
    public const string PlaylistsEdit = "playlists.edit";
    public const string PlaylistsDelete = "playlists.delete";

    public const string LiveStreamsView = "livestreams.view";
    public const string LiveStreamsManage = "livestreams.manage";

    // ═══════════════════════════════════════════════════════════════════════════
    // PODCAST MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string PodcastsView = "podcasts.view";
    public const string PodcastsCreate = "podcasts.create";
    public const string PodcastsEdit = "podcasts.edit";
    public const string PodcastsDelete = "podcasts.delete";
    public const string PodcastsPublish = "podcasts.publish";

    public const string EpisodesView = "episodes.view";
    public const string EpisodesCreate = "episodes.create";
    public const string EpisodesEdit = "episodes.edit";
    public const string EpisodesDelete = "episodes.delete";

    // ═══════════════════════════════════════════════════════════════════════════
    // ANALYTICS
    // ═══════════════════════════════════════════════════════════════════════════

    public const string AnalyticsView = "analytics.view";
    public const string AnalyticsExport = "analytics.export";

    public const string DashboardView = "dashboard.view";
    public const string ReportsGenerate = "reports.generate";

    // ═══════════════════════════════════════════════════════════════════════════
    // SETTINGS MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string SettingsView = "settings.view";
    public const string SettingsEdit = "settings.edit";

    public const string LocalizationView = "localization.view";
    public const string LocalizationEdit = "localization.edit";

    public const string SiteConfigView = "siteconfig.view";
    public const string SiteConfigEdit = "siteconfig.edit";

    // ═══════════════════════════════════════════════════════════════════════════
    // FILE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string FilesView = "files.view";
    public const string FilesUpload = "files.upload";
    public const string FilesDelete = "files.delete";
    public const string FilesManage = "files.manage";

    // ═══════════════════════════════════════════════════════════════════════════
    // ADMIN USER MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    public const string AdminUsersView = "admin.users.view";
    public const string AdminUsersCreate = "admin.users.create";
    public const string AdminUsersEdit = "admin.users.edit";
    public const string AdminUsersDelete = "admin.users.delete";
    public const string AdminRolesAssign = "admin.roles.assign";

    // ═══════════════════════════════════════════════════════════════════════════
    // PERMISSION GROUPS (for convenience)
    // ═══════════════════════════════════════════════════════════════════════════

    /// <summary>
    /// Returns all permissions for User Management module
    /// </summary>
    public static readonly string[] UserManagementPermissions = new[]
    {
        UsersView, UsersCreate, UsersEdit, UsersDelete, UsersExport, UsersImpersonate,
        RolesView, RolesCreate, RolesEdit, RolesDelete, RolesAssign,
        PermissionsView, PermissionsCreate, PermissionsEdit, PermissionsDelete, PermissionsAssign
    };

    /// <summary>
    /// Returns all permissions for Content Management module
    /// </summary>
    public static readonly string[] ContentManagementPermissions = new[]
    {
        ContentView, ContentCreate, ContentEdit, ContentDelete, ContentPublish,
        PagesView, PagesCreate, PagesEdit, PagesDelete,
        FaqView, FaqCreate, FaqEdit, FaqDelete,
        LegalView, LegalEdit
    };

    /// <summary>
    /// Returns all permissions for Community Management module
    /// </summary>
    public static readonly string[] CommunityManagementPermissions = new[]
    {
        CommunityView, CommunityModerate,
        PostsView, PostsEdit, PostsDelete, PostsFeature,
        CommentsView, CommentsModerate, CommentsDelete,
        ReportsView, ReportsResolve
    };

    /// <summary>
    /// Returns all permissions for Marketplace Management module
    /// </summary>
    public static readonly string[] MarketplaceManagementPermissions = new[]
    {
        MarketplaceView, MarketplaceManage,
        ProductsView, ProductsCreate, ProductsEdit, ProductsDelete, ProductsApprove,
        OrdersView, OrdersEdit, OrdersRefund, OrdersCancel,
        VendorsView, VendorsApprove, VendorsManage
    };

    /// <summary>
    /// Returns all permissions for Video Management module
    /// </summary>
    public static readonly string[] VideoManagementPermissions = new[]
    {
        VideosView, VideosCreate, VideosEdit, VideosDelete, VideosPublish,
        PlaylistsView, PlaylistsCreate, PlaylistsEdit, PlaylistsDelete,
        LiveStreamsView, LiveStreamsManage
    };

    /// <summary>
    /// Returns all permissions for Podcast Management module
    /// </summary>
    public static readonly string[] PodcastManagementPermissions = new[]
    {
        PodcastsView, PodcastsCreate, PodcastsEdit, PodcastsDelete, PodcastsPublish,
        EpisodesView, EpisodesCreate, EpisodesEdit, EpisodesDelete
    };

    /// <summary>
    /// Returns all permissions for Analytics module
    /// </summary>
    public static readonly string[] AnalyticsPermissions = new[]
    {
        AnalyticsView, AnalyticsExport,
        DashboardView, ReportsGenerate
    };

    /// <summary>
    /// Returns all permissions for Settings Management module
    /// </summary>
    public static readonly string[] SettingsManagementPermissions = new[]
    {
        SettingsView, SettingsEdit,
        LocalizationView, LocalizationEdit,
        SiteConfigView, SiteConfigEdit,
        FilesView, FilesUpload, FilesDelete, FilesManage
    };

    /// <summary>
    /// Returns all permissions for Admin User Management (SuperAdmin only)
    /// </summary>
    public static readonly string[] AdminManagementPermissions = new[]
    {
        AdminUsersView, AdminUsersCreate, AdminUsersEdit, AdminUsersDelete, AdminRolesAssign
    };
}
