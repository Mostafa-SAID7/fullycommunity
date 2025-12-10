using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Podcasts;

namespace CommunityCar.Application.Common.Interfaces.Podcasts;

public interface ILiveRecordingService
{
    // Live Recording CRUD
    Task<LiveRecordingDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<LiveRecordingListItemDto>> GetByPodcastAsync(Guid podcastId, int page, int pageSize, CancellationToken ct = default);
    Task<List<LiveRecordingListItemDto>> GetUpcomingAsync(int count = 20, CancellationToken ct = default);
    Task<List<LiveRecordingListItemDto>> GetLiveNowAsync(int count = 20, CancellationToken ct = default);
    
    Task<LiveRecordingDto> ScheduleAsync(Guid podcastId, ScheduleLiveRecordingRequest request, CancellationToken ct = default);
    Task<LiveRecordingDto> UpdateAsync(Guid id, UpdateLiveRecordingRequest request, CancellationToken ct = default);
    Task CancelAsync(Guid id, CancellationToken ct = default);
    
    // Stream Control
    Task<StreamCredentialsDto> GetStreamCredentialsAsync(Guid id, CancellationToken ct = default);
    Task<LiveRecordingDto> StartAsync(Guid id, CancellationToken ct = default);
    Task<LiveRecordingDto> PauseAsync(Guid id, CancellationToken ct = default);
    Task<LiveRecordingDto> ResumeAsync(Guid id, CancellationToken ct = default);
    Task<LiveRecordingDto> EndAsync(Guid id, bool createEpisode, CancellationToken ct = default);
    
    // Viewers
    Task JoinAsync(Guid id, Guid? userId, string? sessionId, CancellationToken ct = default);
    Task LeaveAsync(Guid id, Guid? userId, string? sessionId, CancellationToken ct = default);
    Task<int> GetViewerCountAsync(Guid id, CancellationToken ct = default);
    
    // Chat
    Task<PagedResult<LiveChatMessageDto>> GetChatMessagesAsync(Guid id, int page, int pageSize, CancellationToken ct = default);
    Task<LiveChatMessageDto> SendChatMessageAsync(Guid id, Guid userId, string message, Guid? replyToId, CancellationToken ct = default);
    Task DeleteChatMessageAsync(Guid messageId, CancellationToken ct = default);
    Task PinChatMessageAsync(Guid messageId, CancellationToken ct = default);
    Task UnpinChatMessageAsync(Guid messageId, CancellationToken ct = default);
    
    // Tips
    Task<LiveTipDto> SendTipAsync(Guid id, Guid userId, SendTipRequest request, CancellationToken ct = default);
    Task<List<LiveTipDto>> GetRecentTipsAsync(Guid id, int count = 20, CancellationToken ct = default);
}
