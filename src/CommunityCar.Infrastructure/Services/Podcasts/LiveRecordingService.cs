using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Podcasts;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Podcasts;
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Podcasts.Live;
using CommunityCar.Domain.Entities.Podcasts.Common;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Podcasts;

public class LiveRecordingService : ILiveRecordingService
{
    private readonly IAppDbContext _context;

    public LiveRecordingService(IAppDbContext context) => _context = context;

    public async Task<LiveRecordingDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var recording = await _context.Set<LiveRecording>().Include(r => r.PodcastShow).FirstOrDefaultAsync(r => r.Id == id, ct);
        return recording is null ? null : MapToDto(recording);
    }

    public async Task<PagedResult<LiveRecordingListItemDto>> GetByPodcastAsync(Guid podcastId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<LiveRecording>().Include(r => r.PodcastShow).Where(r => r.PodcastShowId == podcastId).OrderByDescending(r => r.ScheduledStartAt);
        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).Select(r => MapToListItem(r)).ToListAsync(ct);
        return new PagedResult<LiveRecordingListItemDto>(items, total, page, pageSize);
    }

    public async Task<List<LiveRecordingListItemDto>> GetUpcomingAsync(int count = 20, CancellationToken ct = default)
    {
        return await _context.Set<LiveRecording>().Include(r => r.PodcastShow)
            .Where(r => r.Status == LiveRecordingStatus.Scheduled && r.ScheduledStartAt > DateTime.UtcNow)
            .OrderBy(r => r.ScheduledStartAt).Take(count).Select(r => MapToListItem(r)).ToListAsync(ct);
    }

    public async Task<List<LiveRecordingListItemDto>> GetLiveNowAsync(int count = 20, CancellationToken ct = default)
    {
        return await _context.Set<LiveRecording>().Include(r => r.PodcastShow)
            .Where(r => r.Status == LiveRecordingStatus.Live).OrderByDescending(r => r.CurrentViewers)
            .Take(count).Select(r => MapToListItem(r)).ToListAsync(ct);
    }

    public async Task<LiveRecordingDto> ScheduleAsync(Guid podcastId, ScheduleLiveRecordingRequest request, CancellationToken ct = default)
    {
        var recording = new LiveRecording
        {
            PodcastShowId = podcastId, Title = request.Title, Description = request.Description, ThumbnailUrl = request.ThumbnailUrl,
            ScheduledStartAt = request.ScheduledStartAt, AllowChat = request.AllowChat, AllowTips = request.AllowTips,
            RecordForEpisode = request.RecordForEpisode, IsSubscribersOnly = request.IsSubscribersOnly, Status = LiveRecordingStatus.Scheduled
        };
        _context.Set<LiveRecording>().Add(recording);
        await _context.SaveChangesAsync(ct);
        return (await GetByIdAsync(recording.Id, ct))!;
    }

    public async Task<LiveRecordingDto> UpdateAsync(Guid id, UpdateLiveRecordingRequest request, CancellationToken ct = default)
    {
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        if (request.Title is not null) recording.Title = request.Title;
        if (request.Description is not null) recording.Description = request.Description;
        if (request.ScheduledStartAt.HasValue) recording.ScheduledStartAt = request.ScheduledStartAt;
        await _context.SaveChangesAsync(ct);
        return (await GetByIdAsync(id, ct))!;
    }

    public async Task CancelAsync(Guid id, CancellationToken ct = default)
    {
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        recording.Status = LiveRecordingStatus.Cancelled;
        await _context.SaveChangesAsync(ct);
    }

    public async Task<StreamCredentialsDto> GetStreamCredentialsAsync(Guid id, CancellationToken ct = default)
    {
        return new StreamCredentialsDto($"rtmp://stream.example.com/live/{id}", Guid.NewGuid().ToString(), DateTime.UtcNow.AddHours(24));
    }

    public async Task<LiveRecordingDto> StartAsync(Guid id, CancellationToken ct = default)
    {
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        recording.Status = LiveRecordingStatus.Live; recording.ActualStartAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return (await GetByIdAsync(id, ct))!;
    }

    public async Task<LiveRecordingDto> PauseAsync(Guid id, CancellationToken ct = default)
    {
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        recording.Status = LiveRecordingStatus.Paused;
        await _context.SaveChangesAsync(ct);
        return (await GetByIdAsync(id, ct))!;
    }

    public async Task<LiveRecordingDto> ResumeAsync(Guid id, CancellationToken ct = default)
    {
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        recording.Status = LiveRecordingStatus.Live;
        await _context.SaveChangesAsync(ct);
        return (await GetByIdAsync(id, ct))!;
    }

    public async Task<LiveRecordingDto> EndAsync(Guid id, bool createEpisode, CancellationToken ct = default)
    {
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct) ?? throw new KeyNotFoundException();
        recording.Status = LiveRecordingStatus.Ended; recording.EndedAt = DateTime.UtcNow;
        if (recording.ActualStartAt.HasValue) recording.Duration = recording.EndedAt - recording.ActualStartAt;
        await _context.SaveChangesAsync(ct);
        return (await GetByIdAsync(id, ct))!;
    }

    public async Task JoinAsync(Guid id, Guid? userId, string? sessionId, CancellationToken ct = default)
    {
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct);
        if (recording is not null) { recording.CurrentViewers++; recording.TotalViewers++; if (recording.CurrentViewers > recording.PeakViewers) recording.PeakViewers = recording.CurrentViewers; await _context.SaveChangesAsync(ct); }
    }

    public async Task LeaveAsync(Guid id, Guid? userId, string? sessionId, CancellationToken ct = default)
    {
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct);
        if (recording is not null && recording.CurrentViewers > 0) { recording.CurrentViewers--; await _context.SaveChangesAsync(ct); }
    }

    public async Task<int> GetViewerCountAsync(Guid id, CancellationToken ct = default)
    {
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct);
        return recording?.CurrentViewers ?? 0;
    }

    public async Task<PagedResult<LiveChatMessageDto>> GetChatMessagesAsync(Guid id, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<LiveRecordingChat>().Include(c => c.User).Where(c => c.LiveRecordingId == id).OrderByDescending(c => c.SentAt);
        var total = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(c => new LiveChatMessageDto(c.Id, c.UserId, c.User.UserName ?? "", c.User.AvatarUrl, c.Message, c.SentAt, c.ReplyToId, null, c.IsPinned, c.IsHighlighted, c.IsHost, c.IsModerator, c.IsSubscriber)).ToListAsync(ct);
        return new PagedResult<LiveChatMessageDto>(items, total, page, pageSize);
    }

    public async Task<LiveChatMessageDto> SendChatMessageAsync(Guid id, Guid userId, string message, Guid? replyToId, CancellationToken ct = default)
    {
        var chat = new LiveRecordingChat { LiveRecordingId = id, UserId = userId, Message = message, ReplyToId = replyToId };
        _context.Set<LiveRecordingChat>().Add(chat);
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct);
        if (recording is not null) recording.ChatMessageCount++;
        await _context.SaveChangesAsync(ct);
        var saved = await _context.Set<LiveRecordingChat>().Include(c => c.User).FirstAsync(c => c.Id == chat.Id, ct);
        return new LiveChatMessageDto(saved.Id, saved.UserId, saved.User.UserName ?? "", saved.User.AvatarUrl, saved.Message, saved.SentAt, saved.ReplyToId, null, saved.IsPinned, saved.IsHighlighted, saved.IsHost, saved.IsModerator, saved.IsSubscriber);
    }

    public async Task DeleteChatMessageAsync(Guid messageId, CancellationToken ct = default)
    {
        var chat = await _context.Set<LiveRecordingChat>().FindAsync([messageId], ct) ?? throw new KeyNotFoundException();
        _context.Set<LiveRecordingChat>().Remove(chat);
        await _context.SaveChangesAsync(ct);
    }

    public async Task PinChatMessageAsync(Guid messageId, CancellationToken ct = default)
    {
        var chat = await _context.Set<LiveRecordingChat>().FindAsync([messageId], ct) ?? throw new KeyNotFoundException();
        chat.IsPinned = true;
        await _context.SaveChangesAsync(ct);
    }

    public async Task UnpinChatMessageAsync(Guid messageId, CancellationToken ct = default)
    {
        var chat = await _context.Set<LiveRecordingChat>().FindAsync([messageId], ct) ?? throw new KeyNotFoundException();
        chat.IsPinned = false;
        await _context.SaveChangesAsync(ct);
    }

    public async Task<LiveTipDto> SendTipAsync(Guid id, Guid userId, SendTipRequest request, CancellationToken ct = default)
    {
        var tip = new LiveRecordingTip { LiveRecordingId = id, SenderId = userId, Amount = request.Amount, Currency = request.Currency, Message = request.Message };
        _context.Set<LiveRecordingTip>().Add(tip);
        var recording = await _context.Set<LiveRecording>().FindAsync([id], ct);
        if (recording is not null) recording.TotalTips += request.Amount;
        await _context.SaveChangesAsync(ct);
        var saved = await _context.Set<LiveRecordingTip>().Include(t => t.Sender).FirstAsync(t => t.Id == tip.Id, ct);
        return new LiveTipDto(saved.Id, saved.SenderId, saved.Sender.UserName ?? "", saved.Sender.AvatarUrl, saved.Amount, saved.Currency, saved.Message, saved.SentAt, saved.IsHighlighted, saved.WasReadOnAir);
    }

    public async Task<List<LiveTipDto>> GetRecentTipsAsync(Guid id, int count = 20, CancellationToken ct = default)
    {
        return await _context.Set<LiveRecordingTip>().Include(t => t.Sender).Where(t => t.LiveRecordingId == id)
            .OrderByDescending(t => t.SentAt).Take(count)
            .Select(t => new LiveTipDto(t.Id, t.SenderId, t.Sender.UserName ?? "", t.Sender.AvatarUrl, t.Amount, t.Currency, t.Message, t.SentAt, t.IsHighlighted, t.WasReadOnAir)).ToListAsync(ct);
    }

    private static LiveRecordingDto MapToDto(LiveRecording r) => new(r.Id, r.PodcastShowId, r.PodcastShow.Title, r.PodcastShow.CoverImageUrl, r.Title, r.Description, r.ThumbnailUrl, r.Status, r.ScheduledStartAt, r.ActualStartAt, r.EndedAt, r.Duration, r.PlaybackUrl, r.PeakViewers, r.TotalViewers, r.CurrentViewers, r.ChatMessageCount, r.TotalTips, r.AllowChat, r.AllowTips, r.IsSubscribersOnly, r.ResultingEpisodeId, r.CreatedAt);
    private static LiveRecordingListItemDto MapToListItem(LiveRecording r) => new(r.Id, r.PodcastShowId, r.PodcastShow.Title, r.PodcastShow.CoverImageUrl, r.Title, r.ThumbnailUrl, r.Status, r.ScheduledStartAt, r.CurrentViewers, r.IsSubscribersOnly);
}
