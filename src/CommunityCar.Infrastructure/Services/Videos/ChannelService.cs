using CommunityCar.Application.Common.Interfaces.Videos;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Videos.Channels;
using CommunityCar.Domain.Entities.Videos.Channels;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Videos;

public class ChannelService : IChannelService
{
    private readonly AppDbContext _context;

    public ChannelService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ChannelDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var channel = await _context.Set<Channel>()
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted, ct);
        return channel == null ? null : MapToDto(channel);
    }

    public async Task<ChannelDto?> GetByHandleAsync(string handle, CancellationToken ct = default)
    {
        var channel = await _context.Set<Channel>()
            .FirstOrDefaultAsync(c => c.Handle == handle && !c.IsDeleted, ct);
        return channel == null ? null : MapToDto(channel);
    }

    public async Task<ChannelDto?> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        var channel = await _context.Set<Channel>()
            .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsDeleted, ct);
        return channel == null ? null : MapToDto(channel);
    }

    public async Task<PagedResult<ChannelListItemDto>> SearchAsync(ChannelSearchRequest request, CancellationToken ct = default)
    {
        var query = _context.Set<Channel>().Where(c => !c.IsDeleted && c.Status == ChannelStatus.Active);

        if (!string.IsNullOrEmpty(request.Query))
            query = query.Where(c => c.DisplayName.Contains(request.Query) || c.Handle.Contains(request.Query));

        var total = await query.CountAsync(ct);
        var page = request.Page ?? 1;
        var pageSize = request.PageSize ?? 20;

        var items = await query
            .OrderByDescending(c => c.SubscriberCount)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new ChannelListItemDto
            {
                Id = c.Id,
                Handle = c.Handle,
                DisplayName = c.DisplayName,
                AvatarUrl = c.AvatarUrl,
                IsVerified = c.IsVerified,
                SubscriberCount = c.SubscriberCount
            })
            .ToListAsync(ct);

        return new PagedResult<ChannelListItemDto>(items, total, page, pageSize);
    }

    public async Task<List<ChannelListItemDto>> GetTrendingAsync(int count = 10, CancellationToken ct = default)
    {
        return await _context.Set<Channel>()
            .Where(c => !c.IsDeleted && c.Status == ChannelStatus.Active)
            .OrderByDescending(c => c.TotalViews)
            .Take(count)
            .Select(c => new ChannelListItemDto
            {
                Id = c.Id,
                Handle = c.Handle,
                DisplayName = c.DisplayName,
                AvatarUrl = c.AvatarUrl,
                IsVerified = c.IsVerified,
                SubscriberCount = c.SubscriberCount
            })
            .ToListAsync(ct);
    }

    public async Task<List<ChannelListItemDto>> GetSuggestedAsync(Guid userId, int count = 10, CancellationToken ct = default)
    {
        return await _context.Set<Channel>()
            .Where(c => !c.IsDeleted && c.Status == ChannelStatus.Active && c.UserId != userId)
            .OrderByDescending(c => c.SubscriberCount)
            .Take(count)
            .Select(c => new ChannelListItemDto
            {
                Id = c.Id,
                Handle = c.Handle,
                DisplayName = c.DisplayName,
                AvatarUrl = c.AvatarUrl,
                IsVerified = c.IsVerified,
                SubscriberCount = c.SubscriberCount
            })
            .ToListAsync(ct);
    }

    public async Task<ChannelDto> CreateAsync(Guid userId, CreateChannelRequest request, CancellationToken ct = default)
    {
        var channel = new Channel
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Handle = request.Handle,
            DisplayName = request.DisplayName,
            Bio = request.Bio,
            Status = ChannelStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        _context.Set<Channel>().Add(channel);
        await _context.SaveChangesAsync(ct);
        return MapToDto(channel);
    }

    public async Task<ChannelDto> UpdateAsync(Guid id, UpdateChannelRequest request, CancellationToken ct = default)
    {
        var channel = await _context.Set<Channel>().FindAsync(new object[] { id }, ct);
        if (channel == null) throw new Exception("Channel not found");

        if (request.DisplayName != null) channel.DisplayName = request.DisplayName;
        if (request.Bio != null) channel.Bio = request.Bio;
        if (request.AvatarUrl != null) channel.AvatarUrl = request.AvatarUrl;
        if (request.BannerUrl != null) channel.BannerUrl = request.BannerUrl;

        await _context.SaveChangesAsync(ct);
        return MapToDto(channel);
    }

    public async Task<ChannelStatsDto> GetStatsAsync(Guid channelId, CancellationToken ct = default)
    {
        var channel = await _context.Set<Channel>().FindAsync(new object[] { channelId }, ct);
        return new ChannelStatsDto
        {
            TotalViews = channel?.TotalViews ?? 0,
            TotalLikes = channel?.TotalLikes ?? 0,
            SubscriberCount = channel?.SubscriberCount ?? 0,
            VideoCount = channel?.VideoCount ?? 0
        };
    }

    public Task SubscribeAsync(Guid channelId, Guid userId, CancellationToken ct = default) => Task.CompletedTask;
    public Task UnsubscribeAsync(Guid channelId, Guid userId, CancellationToken ct = default) => Task.CompletedTask;
    public Task<bool> IsSubscribedAsync(Guid channelId, Guid userId, CancellationToken ct = default) => Task.FromResult(false);
    public Task<PagedResult<ChannelListItemDto>> GetSubscriptionsAsync(Guid userId, int page, int pageSize, CancellationToken ct = default) 
        => Task.FromResult(new PagedResult<ChannelListItemDto>(new List<ChannelListItemDto>(), 0, page, pageSize));
    public Task<PagedResult<ChannelListItemDto>> GetSubscribersAsync(Guid channelId, int page, int pageSize, CancellationToken ct = default)
        => Task.FromResult(new PagedResult<ChannelListItemDto>(new List<ChannelListItemDto>(), 0, page, pageSize));

    private static ChannelDto MapToDto(Channel c) => new()
    {
        Id = c.Id,
        UserId = c.UserId,
        Handle = c.Handle,
        DisplayName = c.DisplayName,
        Bio = c.Bio,
        AvatarUrl = c.AvatarUrl,
        BannerUrl = c.BannerUrl,
        IsVerified = c.IsVerified,
        SubscriberCount = c.SubscriberCount,
        VideoCount = c.VideoCount,
        TotalViews = c.TotalViews,
        CreatedAt = c.CreatedAt
    };
}
