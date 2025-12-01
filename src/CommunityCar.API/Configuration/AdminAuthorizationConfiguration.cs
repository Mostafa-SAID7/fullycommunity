using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using CommunityCar.Infrastructure.Security;
using CommunityCar.Domain.Constants;

namespace CommunityCar.API.Configuration;

/// <summary>
/// Configures admin authorization policies for role-based and permission-based access control
/// </summary>
public static class AdminAuthorizationConfiguration
{
    public static IServiceCollection AddAdminAuthorization(this IServiceCollection services)
    {
        // Register authorization handler
        services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

        services.AddAuthorization(options =>
        {
            // ═══════════════════════════════════════════════════════════════════
            // SUPER ADMIN
            // ═══════════════════════════════════════════════════════════════════

            options.AddPolicy("SuperAdmin", policy =>
                policy.RequireRole("SuperAdmin"));

            // ═══════════════════════════════════════════════════════════════════
            // USER MANAGEMENT
            // ═══════════════════════════════════════════════════════════════════

            options.AddPolicy("UserManagement", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("SuperAdmin") ||
                    context.User.IsInRole("UserAdmin")));

            options.AddPolicy(PermissionPolicies.UsersView, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.UsersView)));

            options.AddPolicy(PermissionPolicies.UsersManage, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.UsersEdit)));

            // ═══════════════════════════════════════════════════════════════════
            // CONTENT MANAGEMENT
            // ═══════════════════════════════════════════════════════════════════

            options.AddPolicy("ContentManagement", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("SuperAdmin") ||
                    context.User.IsInRole("ContentAdmin")));

            options.AddPolicy(PermissionPolicies.ContentView, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.ContentView)));

            options.AddPolicy(PermissionPolicies.ContentManage, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.ContentEdit)));

            // ═══════════════════════════════════════════════════════════════════
            // COMMUNITY MANAGEMENT
            // ═══════════════════════════════════════════════════════════════════

            options.AddPolicy("CommunityManagement", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("SuperAdmin") ||
                    context.User.IsInRole("CommunityAdmin")));

            options.AddPolicy(PermissionPolicies.CommunityView, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.CommunityView)));

            options.AddPolicy(PermissionPolicies.CommunityManage, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.CommunityModerate)));

            // ═══════════════════════════════════════════════════════════════════
            // MARKETPLACE MANAGEMENT
            // ═══════════════════════════════════════════════════════════════════

            options.AddPolicy("MarketplaceManagement", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("SuperAdmin") ||
                    context.User.IsInRole("MarketplaceAdmin")));

            options.AddPolicy(PermissionPolicies.MarketplaceView, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.MarketplaceView)));

            options.AddPolicy(PermissionPolicies.MarketplaceManage, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.MarketplaceManage)));

            // ═══════════════════════════════════════════════════════════════════
            // VIDEO MANAGEMENT
            // ═══════════════════════════════════════════════════════════════════

            options.AddPolicy("VideoManagement", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("SuperAdmin") ||
                    context.User.IsInRole("VideoAdmin")));

            options.AddPolicy(PermissionPolicies.VideosView, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.VideosView)));

            options.AddPolicy(PermissionPolicies.VideosManage, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.VideosEdit)));

            // ═══════════════════════════════════════════════════════════════════
            // PODCAST MANAGEMENT
            // ═══════════════════════════════════════════════════════════════════

            options.AddPolicy("PodcastManagement", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("SuperAdmin") ||
                    context.User.IsInRole("PodcastAdmin")));

            options.AddPolicy(PermissionPolicies.PodcastsView, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.PodcastsView)));

            options.AddPolicy(PermissionPolicies.PodcastsManage, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.PodcastsEdit)));

            // ═══════════════════════════════════════════════════════════════════
            // ANALYTICS
            // ═══════════════════════════════════════════════════════════════════

            options.AddPolicy("AnalyticsView", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("SuperAdmin") ||
                    context.User.IsInRole("AnalyticsAdmin") ||
                    context.User.HasClaim("permission", AdminPermissions.AnalyticsView)));

            options.AddPolicy(PermissionPolicies.AnalyticsView, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.AnalyticsView)));

            // ═══════════════════════════════════════════════════════════════════
            // SETTINGS MANAGEMENT
            // ═══════════════════════════════════════════════════════════════════

            options.AddPolicy("SettingsManagement", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("SuperAdmin") ||
                    context.User.IsInRole("SettingsAdmin")));

            options.AddPolicy(PermissionPolicies.SettingsView, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.SettingsView)));

            options.AddPolicy(PermissionPolicies.SettingsManage, policy =>
                policy.AddRequirements(new PermissionRequirement(AdminPermissions.SettingsEdit)));
        });

        return services;
    }
}
