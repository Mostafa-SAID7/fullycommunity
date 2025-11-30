using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Videos.Channels;
using CommunityCar.Domain.Entities.Videos.Common;
using CommunityCar.Domain.Entities.Videos.Content;

namespace CommunityCar.Domain.Entities.Videos.LiveStream;

/// <summary>
/// Live streaming session
/// </summary>
public class LiveStream : BaseEntity
{
    public Guid ChannelId { get; set; }
    public Channel Channel { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ThumbnailUrl { get; set; }
    
    // Stream Info
    public string StreamKey { get; set; } = string.Empty;
    public string? StreamUrl { get; set; }
    public string? PlaybackUrl { get; set; }
    public string? ChatRoomId { get; set; }
    
    // Status
    public LiveStreamStatus Status { get; set; } = LiveStreamStatus.Scheduled;
    public StreamQuality Quality { get; set; } = StreamQuality.High;
    public ContentRating ContentRating { get; set; } = ContentRating.General;
    
    // Schedule
    public DateTime? ScheduledStartAt { get; set; }
    public DateTime? ActualStartAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public TimeSpan Duration { get; set; }
    
    // Stats
    public int PeakViewers { get; set; }
    public int CurrentViewers { get; set; }
    public int TotalViewers { get; set; }
    public int LikeCount { get; set; }
    public int ChatMessageCount { get; set; }
    
    // Settings
    public bool AllowChat { get; set; } = true;
    public bool SlowModeEnabled { get; set; }
    public int SlowModeSeconds { get; set; } = 5;
    public bool SubscribersOnlyChat { get; set; }
    public bool AllowGifts { get; set; } = true;
    
    // Recording
    public bool SaveRecording { get; set; } = true;
    public Guid? RecordedVideoId { get; set; }
    public Video? RecordedVideo { get; set; }
    
    // Monetization
    public bool IsMonetized { get; set; }
    public decimal TotalGiftsReceived { get; set; }
    public decimal TotalEarnings { get; set; }
    
    // Category
    public Guid? CategoryId { get; set; }
    public VideoCategory? Category { get; set; }
    public List<string> Tags { get; set; } = [];
    
    // Navigation
    public List<LiveStreamChat> ChatMessages { get; set; } = [];
    public List<LiveStreamGift> Gifts { get; set; } = [];
}
