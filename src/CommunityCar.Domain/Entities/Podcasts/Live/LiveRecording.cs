using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Podcasts.Common;
using CommunityCar.Domain.Entities.Podcasts.Shows;

namespace CommunityCar.Domain.Entities.Podcasts.Live;

/// <summary>
/// Live podcast recording session
/// </summary>
public class LiveRecording : BaseEntity
{
    public Guid PodcastShowId { get; set; }
    public PodcastShow PodcastShow { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ThumbnailUrl { get; set; }
    
    // Status
    public LiveRecordingStatus Status { get; set; } = LiveRecordingStatus.Scheduled;
    
    // Scheduling
    public DateTime? ScheduledStartAt { get; set; }
    public DateTime? ActualStartAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public TimeSpan? Duration { get; set; }
    
    // Stream Info
    public string? StreamUrl { get; set; }
    public string? StreamKey { get; set; }
    public string? PlaybackUrl { get; set; }
    
    // Stats
    public int PeakViewers { get; set; }
    public int TotalViewers { get; set; }
    public int CurrentViewers { get; set; }
    public int ChatMessageCount { get; set; }
    public int TipCount { get; set; }
    public decimal TotalTips { get; set; }
    
    // Settings
    public bool AllowChat { get; set; } = true;
    public bool AllowTips { get; set; } = true;
    public bool RecordForEpisode { get; set; } = true;
    public bool IsSubscribersOnly { get; set; }
    
    // Resulting Episode
    public Guid? ResultingEpisodeId { get; set; }
    public PodcastEpisode? ResultingEpisode { get; set; }
    
    // Navigation
    public List<LiveRecordingChat> ChatMessages { get; set; } = [];
    public List<LiveRecordingTip> Tips { get; set; } = [];
}
