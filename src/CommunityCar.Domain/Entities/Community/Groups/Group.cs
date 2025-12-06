using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Groups;

namespace CommunityCar.Domain.Entities.Community.Groups;

public class Group : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    
    public Guid OwnerId { get; set; }
    public ApplicationUser Owner { get; set; } = null!;
    
    // Media
    public string? CoverImageUrl { get; set; }
    public string? AvatarUrl { get; set; }
    
    // Settings
    public GroupPrivacy Privacy { get; set; } = GroupPrivacy.Public;
    public GroupType Type { get; set; } = GroupType.General;
    public bool RequiresApproval { get; set; }
    public bool AllowMemberPosts { get; set; } = true;
    
    // Stats
    public int MemberCount { get; set; }
    public int PostCount { get; set; }
    
    // Location (for local groups)
    public string? City { get; set; }
    public string? Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    // Rules
    public string? Rules { get; set; }
    
    public List<GroupMember> Members { get; set; } = [];
    public List<GroupPost> Posts { get; set; } = [];
}
