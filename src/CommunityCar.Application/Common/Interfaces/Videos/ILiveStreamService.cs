using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Videos.LiveStream;
using CommunityCar.Domain.Entities.Videos.Common;

namespace CommunityCar.Application.Common.Interfaces.Videos;

public interface ILiveStreamService
{
    Task<LiveStreamDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<LiveStreamListItemDto>> SearchAsync(LiveStreamSearchRequest request, CancellationToken ct = default);
    Task<List<LiveStreamListItemDto>> GetLiveNowAsync(int count = 20, CancellationToken ct = default);
    Task<List<LiveStreamListItemDto>> GetUpcomingAsync(int count = 20, CancellationToken ct = default);
    Task<PagedResult<LiveStreamListItemDto>> GetChannelStreamsAsync(Guid channelId, int page, int pageSize, CancellationToken ct = default);
    
    Task<LiveStreamDto> CreateAsync(Guid channelId, CreateLiveStreamRequest request, CancellationToken ct = default);
    Task<StartLiveStreamResponse> StartAsync(Guid id, CancellationToken ct = default);
    Task PauseAsync(Guid id, CancellationToken ct = default);
    Task ResumeAsync(Guid id, CancellationToken ct = default);
    Task EndAsync(Guid id, CancellationToken ct = default);
    Task CancelAsync(Guid id, CancellationToken ct = default);
    
    // Chat
    Task<LiveStreamChatDto> SendChatMessageAsync(Guid liveStreamId, Guid userId, SendChatMessageRequest request, CancellationToken ct = default);
    Task<PagedResult<LiveStreamChatDto>> GetChatMessagesAsync(Guid liveStreamId, int page, int pageSize, CancellationToken ct = default);
    Task DeleteChatMessageAsync(Guid messageId, CancellationToken ct = default);
    Task PinChatMessageAsync(Guid messageId, CancellationToken ct = default);
    
    // Gifts
    Task<LiveStreamGiftDto> SendGiftAsync(Guid liveStreamId, Guid userId, SendGiftRequest request, CancellationToken ct = default);
    Task<List<GiftTypeDto>> GetGiftTypesAsync(CancellationToken ct = default);
    Task<List<LiveStreamGiftDto>> GetRecentGiftsAsync(Guid liveStreamId, int count = 20, CancellationToken ct = default);
    
    // Viewers
    Task JoinStreamAsync(Guid liveStreamId, Guid? userId, CancellationToken ct = default);
    Task LeaveStreamAsync(Guid liveStreamId, Guid? userId, CancellationToken ct = default);
    Task<int> GetViewerCountAsync(Guid liveStreamId, CancellationToken ct = default);
}
