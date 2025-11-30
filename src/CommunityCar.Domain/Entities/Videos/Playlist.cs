using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Videos;

public class Playlist : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }

    public bool IsPublic { get; set; } = true;

    public Guid CreatorId { get; set; }
    public ApplicationUser Creator { get; set; } = null!;

    public List<Video> Videos { get; set; } = [];
}
