using Microsoft.AspNetCore.Authorization;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Identity;
using System.Security.Claims;

namespace CommunityCar.Infrastructure.Security;

/// <summary>
/// Permission-based authorization handler
/// Validates if the user has the required permission
/// SuperAdmin bypasses all permission checks
/// </summary>
public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly IRoleService _roleService;

    public PermissionAuthorizationHandler(IRoleService roleService)
    {
        _roleService = roleService;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return;
        }

        // SuperAdmin bypasses all permission checks
        if (context.User.IsInRole("SuperAdmin"))
        {
            context.Succeed(requirement);
            return;
        }

        // Check if user has the required permission
        var hasPermission = await _roleService.UserHasPermissionAsync(userId, requirement.Permission);

        if (hasPermission)
        {
            context.Succeed(requirement);
        }
    }
}

/// <summary>
/// Permission requirement for authorization
/// </summary>
public class PermissionRequirement : IAuthorizationRequirement
{
    public string Permission { get; }

    public PermissionRequirement(string permission)
    {
        Permission = permission;
    }
}

/// <summary>
/// Permission policy names for use in [Authorize] attributes
/// </summary>
public static class PermissionPolicies
{
    // User Management
    public const string UsersView = "Permission.Users.View";
    public const string UsersManage = "Permission.Users.Manage";

    // Content Management
    public const string ContentView = "Permission.Content.View";
    public const string ContentManage = "Permission.Content.Manage";

    // Community Management
    public const string CommunityView = "Permission.Community.View";
    public const string CommunityManage = "Permission.Community.Manage";

    // Marketplace Management
    public const string MarketplaceView = "Permission.Marketplace.View";
    public const string MarketplaceManage = "Permission.Marketplace.Manage";

    // Video Management
    public const string VideosView = "Permission.Videos.View";
    public const string VideosManage = "Permission.Videos.Manage";

    // Podcast Management
    public const string PodcastsView = "Permission.Podcasts.View";
    public const string PodcastsManage = "Permission.Podcasts.Manage";

    // Analytics
    public const string AnalyticsView = "Permission.Analytics.View";

    // Settings Management
    public const string SettingsView = "Permission.Settings.View";
    public const string SettingsManage = "Permission.Settings.Manage";
}
