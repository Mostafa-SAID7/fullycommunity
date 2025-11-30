using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Features.Videos.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Application.Features.Videos.Queries.GetPlaylist;

public class GetPlaylistQueryHandler : IRequestHandler<GetPlaylistQuery, PlaylistDto?>
{
    private readonly IAppDbContext _context;

    public GetPlaylistQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<PlaylistDto?> Handle(GetPlaylistQuery request, CancellationToken cancellationToken)
    {
        var playlist = await _context.Playlists
            .Include(p => p.Creator)
            .Include(p => p.Videos)
                .ThenInclude(v => v.Author)
            .Where(p => p.Id == request.PlaylistId)
            .Select(p => new PlaylistDto(
                p.Id,
                p.Title,
                p.Description,
                p.CoverImageUrl,
                p.IsPublic,
                p.CreatorId,
                p.Creator.UserName ?? "",
                p.Videos.Count,
                p.CreatedAt,
                p.Videos.OrderBy(v => v.CreatedAt).Select(v => new VideoListDto(
                    v.Id,
                    v.Title,
                    v.ThumbnailUrl,
                    v.Duration,
                    v.Type,
                    v.IsLive,
                    v.ViewCount,
                    v.LikeCount,
                    v.AuthorId,
                    v.Author.UserName ?? "",
                    v.CreatedAt
                )).ToList()
            ))
            .FirstOrDefaultAsync(cancellationToken);

        return playlist;
    }
}
