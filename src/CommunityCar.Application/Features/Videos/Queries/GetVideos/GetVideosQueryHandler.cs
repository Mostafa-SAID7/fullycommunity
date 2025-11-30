using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Videos.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Application.Features.Videos.Queries.GetVideos;

public class GetVideosQueryHandler : IRequestHandler<GetVideosQuery, PagedResult<VideoListDto>>
{
    private readonly IAppDbContext _context;

    public GetVideosQueryHandler(IAppDbContext context) => _context = context;

    public async Task<PagedResult<VideoListDto>> Handle(GetVideosQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Videos
            .Include(v => v.Channel)
            .AsQueryable();

        if (request.Type.HasValue)
            query = query.Where(v => v.Type == request.Type.Value);

        if (request.CategoryId.HasValue)
            query = query.Where(v => v.CategoryId == request.CategoryId.Value);

        if (request.AuthorId.HasValue)
            query = query.Where(v => v.ChannelId == request.AuthorId.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var videos = await query
            .OrderByDescending(v => v.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(v => new VideoListDto(
                v.Id,
                v.Title,
                v.ThumbnailUrl,
                v.Duration,
                v.Type,
                v.Type == Domain.Entities.Videos.Common.VideoType.LiveStream,
                (int)v.ViewCount,
                v.LikeCount,
                v.ChannelId,
                v.Channel.DisplayName,
                v.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        return new PagedResult<VideoListDto>(videos, totalCount, request.Page, request.PageSize);
    }
}
