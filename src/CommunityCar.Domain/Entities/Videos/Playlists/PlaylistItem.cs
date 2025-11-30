using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Videos.Content;

namespace CommunityCar.Domain.Entities.Videos.Playlists;

public class PlaylistItem : BaseEntity
{
    public Guid PlaylistId { get; set; }
    public Playlist Playlist { get; set; } = null!;
    
    public Guid VideoId { get; set; }
    public Video Video { get; set; } = null!;
    
    public int Position { get; set; }
    public string? Note { get; set; }
    
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
