using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Features.Videos.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Application.Features.Videos.Queries.GetPlaylist;

public class GetPlaylistQueryHandler : IRequestHandler<GetPlaylistQuery, PlaylistDto?>
{
    private readonly IAppDbContext _context;

    public GetPlaylistQueryHandler(IAppDbContext context) => _context = context;

    public async Task<PlaylistDto?> Handle(GetPlaylistQuery request, CancellationToken cancellationToken)
    {
        var playlist = await _context.Playlists
            .Include(p => p.Channel)
            .Include(p => p.Items)
            .Where(p => p.Id == request.PlaylistId)
            .Select(p => new PlaylistDto(
                p.Id,
                p.Title,
                p.Description ?? string.Empty,
                p.ThumbnailUrl,
                p.Visibility == Domain.Entities.Videos.Common.VideoVisibility.Public,
                p.ChannelId,
                p.Channel.DisplayName,
                p.VideoCount,
                p.CreatedAt,
                new List<VideoListDto>()
            ))
            .FirstOrDefaultAsync(cancellationToken);

        return playlist;
    }
}
