using CommunityCar.Application.Common.Constants;
using CommunityCar.Application.Common.Enums;
using CommunityCar.Domain.Enums;

namespace CommunityCar.Application.Common.Services;

/// <summary>
/// Service for managing admin permissions based on roles
/// </summary>
public interface IAdminPermissionService
{
    /// <summary>
    /// Get permissions for a specific admin role type
    /// </summary>
    List<string> GetPermissionsForRole(AdminRoleType roleType, ContentAdminSpecialization? specialization = null);
    
    /// <summary>
    /// Get permissions for multiple roles
    /// </summary>
    List<string> GetPermissionsForRoles(IEnumerable<string> roles, ContentAdminSpecialization? specialization = null);
    
    /// <summary>
    /// Check if a user has a specific permission
    /// </summary>
    bool HasPermission(List<string> userPermissions, string requiredPermission);
}

public class AdminPermissionService : IAdminPermissionService
{
    public List<string> GetPermissionsForRole(AdminRoleType roleType, ContentAdminSpecialization? specialization = null)
    {
        return roleType switch
        {
            AdminRoleType.SuperAdmin => AdminPermissions.GetSuperAdminPermissions(),
            AdminRoleType.Admin => AdminPermissions.GetAdminPermissions(),
            AdminRoleType.ContentAdmin => GetContentAdminPermissions(specialization),
            AdminRoleType.ServicesAdmin => AdminPermissions.GetServicesAdminPermissions(),
            AdminRoleType.MarketplaceAdmin => AdminPermissions.GetMarketplaceAdminPermissions(),
            AdminRoleType.CMSAdmin => AdminPermissions.GetCMSAdminPermissions(),
            _ => new List<string>()
        };
    }

    public List<string> GetPermissionsForRoles(IEnumerable<string> roles, ContentAdminSpecialization? specialization = null)
    {
        var permissions = new HashSet<string>();
        
        foreach (var role in roles)
        {
            var rolePermissions = role switch
            {
                "SuperAdmin" => AdminPermissions.GetSuperAdminPermissions(),
                "Admin" => AdminPermissions.GetAdminPermissions(),
                "ContentAdmin" => GetContentAdminPermissions(specialization),
                "ServicesAdmin" => AdminPermissions.GetServicesAdminPermissions(),
                "MarketplaceAdmin" => AdminPermissions.GetMarketplaceAdminPermissions(),
                "CMSAdmin" => AdminPermissions.GetCMSAdminPermissions(),
                _ => new List<string>()
            };
            
            foreach (var permission in rolePermissions)
            {
                permissions.Add(permission);
            }
        }
        
        return permissions.ToList();
    }

    public bool HasPermission(List<string> userPermissions, string requiredPermission)
    {
        // SuperAdmin has all permissions
        if (userPermissions.Contains(AdminPermissions.All))
            return true;
            
        return userPermissions.Contains(requiredPermission);
    }

    private List<string> GetContentAdminPermissions(ContentAdminSpecialization? specialization)
    {
        if (specialization == null || specialization == ContentAdminSpecialization.All)
        {
            // Full ContentAdmin with all specializations
            var allPermissions = new List<string>();
            allPermissions.AddRange(AdminPermissions.GetContentAdminCommunityPermissions());
            allPermissions.AddRange(AdminPermissions.GetContentAdminVideosPermissions());
            allPermissions.AddRange(AdminPermissions.GetContentAdminPodcastsPermissions());
            return allPermissions.Distinct().ToList();
        }
        
        return specialization switch
        {
            ContentAdminSpecialization.Community => AdminPermissions.GetContentAdminCommunityPermissions(),
            ContentAdminSpecialization.Videos => AdminPermissions.GetContentAdminVideosPermissions(),
            ContentAdminSpecialization.Podcasts => AdminPermissions.GetContentAdminPodcastsPermissions(),
            _ => new List<string>()
        };
    }
}
