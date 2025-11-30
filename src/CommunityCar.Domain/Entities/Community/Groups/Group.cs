using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

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

public enum GroupPrivacy { Public, Private, Secret }
public enum GroupType { General, CarBrand, CarModel, Location, Interest, Official }

public class GroupMember
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GroupId { get; set; }
    public Group Group { get; set; } = null!;
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public GroupRole Role { get; set; } = GroupRole.Member;
    public MemberStatus Status { get; set; } = MemberStatus.Active;
    
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public Guid? InvitedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    
    public bool NotificationsEnabled { get; set; } = true;
}

public enum GroupRole { Member, Moderator, Admin, Owner }
public enum MemberStatus { Pending, Active, Banned, Left }

public class GroupPost
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GroupId { get; set; }
    public Group Group { get; set; } = null!;
    public Guid PostId { get; set; }
    public bool IsPinned { get; set; }
    public bool IsAnnouncement { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
