using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Videos.Channels;

namespace CommunityCar.Application.Common.Interfaces.Videos;

public interface IChannelService
{
    Task<ChannelDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ChannelDto?> GetByHandleAsync(string handle, CancellationToken ct = default);
    Task<ChannelDto?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<PagedResult<ChannelListItemDto>> SearchAsync(ChannelSearchRequest request, CancellationToken ct = default);
    Task<List<ChannelListItemDto>> GetSuggestedAsync(Guid userId, int count = 10, CancellationToken ct = default);
    Task<List<ChannelListItemDto>> GetTrendingAsync(int count = 10, CancellationToken ct = default);
    
    Task<ChannelDto> CreateAsync(Guid userId, CreateChannelRequest request, CancellationToken ct = default);
    Task<ChannelDto> UpdateAsync(Guid id, UpdateChannelRequest request, CancellationToken ct = default);
    Task<ChannelStatsDto> GetStatsAsync(Guid channelId, CancellationToken ct = default);
    
    Task SubscribeAsync(Guid channelId, Guid userId, CancellationToken ct = default);
    Task UnsubscribeAsync(Guid channelId, Guid userId, CancellationToken ct = default);
    Task<bool> IsSubscribedAsync(Guid channelId, Guid userId, CancellationToken ct = default);
    Task<PagedResult<ChannelListItemDto>> GetSubscriptionsAsync(Guid userId, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<ChannelListItemDto>> GetSubscribersAsync(Guid channelId, int page, int pageSize, CancellationToken ct = default);
    
    Task UpdateNotificationSettingsAsync(Guid channelId, Guid userId, bool notifyOnUpload, bool notifyOnLive, CancellationToken ct = default);
}
