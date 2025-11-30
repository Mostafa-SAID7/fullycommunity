using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Features.Videos.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Application.Features.Videos.Queries.GetVideo;

public class GetVideoQueryHandler : IRequestHandler<GetVideoQuery, VideoDto?>
{
    private readonly IAppDbContext _context;

    public GetVideoQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<VideoDto?> Handle(GetVideoQuery request, CancellationToken cancellationToken)
    {
        var video = await _context.Videos
            .Include(v => v.Author)
            .Include(v => v.Category)
            .Where(v => v.Id == request.VideoId)
            .Select(v => new VideoDto(
                v.Id,
                v.Title,
                v.Description,
                v.VideoUrl,
                v.ThumbnailUrl,
                v.Duration,
                v.Type,
                v.IsLive,
                v.ViewCount,
                v.LikeCount,
                v.CommentCount,
                v.AuthorId,
                v.Author.UserName ?? "",
                v.CategoryId,
                v.Category != null ? v.Category.Name : null,
                v.PlaylistId,
                v.CreatedAt
            ))
            .FirstOrDefaultAsync(cancellationToken);

        return video;
    }
}
