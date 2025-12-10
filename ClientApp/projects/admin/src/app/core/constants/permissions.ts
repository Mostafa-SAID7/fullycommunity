/**
 * Admin Permission Constants (must match backend)
 */
export const AdminPermissions = {
    // Super Admin
    All: 'admin.all',

    // System Management
    ManageUsers: 'admin.users.manage',
    ManageRoles: 'admin.roles.manage',
    ViewLogs: 'admin.logs.view',
    ManageSettings: 'admin.settings.manage',

    // Content Admin - Community
    ContentCommunityView: 'admin.content.community.view',
    ContentCommunityCreate: 'admin.content.community.create',
    ContentCommunityEdit: 'admin.content.community.edit',
    ContentCommunityDelete: 'admin.content.community.delete',
    ContentCommunityModerate: 'admin.content.community.moderate',

    // QA Management (part of community)
    ContentCommunityQAView: 'admin.content.community.qa.view',
    ContentCommunityQAManage: 'admin.content.community.qa.manage',
    ContentCommunityQAModerate: 'admin.content.community.qa.moderate',

    // News (part of community)
    ContentCommunityNewsView: 'admin.content.community.news.view',
    ContentCommunityNewsManage: 'admin.content.community.news.manage',

    // Pages (part of community)
    ContentCommunityPagesView: 'admin.content.community.pages.view',
    ContentCommunityPagesManage: 'admin.content.community.pages.manage',

    // Content Admin - Videos
    ContentVideosView: 'admin.content.videos.view',
    ContentVideosCreate: 'admin.content.videos.create',
    ContentVideosEdit: 'admin.content.videos.edit',
    ContentVideosDelete: 'admin.content.videos.delete',
    ContentVideosModerate: 'admin.content.videos.moderate',
    ContentLiveStreamManage: 'admin.content.livestream.manage',

    // Content Admin - Podcasts
    ContentPodcastsView: 'admin.content.podcasts.view',
    ContentPodcastsCreate: 'admin.content.podcasts.create',
    ContentPodcastsEdit: 'admin.content.podcasts.edit',
    ContentPodcastsDelete: 'admin.content.podcasts.delete',
    ContentPodcastsModerate: 'admin.content.podcasts.moderate',

    // Services Admin
    ServicesView: 'admin.services.view',
    ServicesMaintenanceManage: 'admin.services.maintenance.manage',
    ServicesRoadsideManage: 'admin.services.roadside.manage',
    ServicesRepairManage: 'admin.services.repair.manage',
    ServicesDrivingSchoolManage: 'admin.services.drivingschool.manage',
    ServicesProvidersManage: 'admin.services.providers.manage',

    // Marketplace Admin
    MarketplaceView: 'admin.marketplace.view',
    MarketplaceListingsManage: 'admin.marketplace.listings.manage',
    MarketplaceCategoriesManage: 'admin.marketplace.categories.manage',
    MarketplaceOrdersView: 'admin.marketplace.orders.view',
    MarketplaceReportsHandle: 'admin.marketplace.reports.handle',

    // Analytics & Reports
    AnalyticsView: 'admin.analytics.view',
    ReportsGenerate: 'admin.reports.generate',

    // CMS (Static pages - separate from content)
    CMSAboutManage: 'admin.cms.about.manage',
    CMSFAQManage: 'admin.cms.faq.manage',
    CMSLegalManage: 'admin.cms.legal.manage',
    CMSCareersManage: 'admin.cms.careers.manage'
} as const;

export type Permission = typeof AdminPermissions[keyof typeof AdminPermissions];
