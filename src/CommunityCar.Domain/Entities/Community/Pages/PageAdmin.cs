using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Pages;

namespace CommunityCar.Domain.Entities.Community.Pages;

public class PageAdmin : BaseEntity
{
    public Guid PageId { get; set; }
    public Page Page { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public PageRole Role { get; set; } = PageRole.Admin;
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public Guid AssignedById { get; set; }
}
