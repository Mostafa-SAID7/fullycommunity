using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Groups;

namespace CommunityCar.Domain.Entities.Community.Groups;

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
