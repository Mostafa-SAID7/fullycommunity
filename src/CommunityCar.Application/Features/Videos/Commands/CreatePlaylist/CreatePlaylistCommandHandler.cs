using CommunityCar.Domain.Entities.Videos.Playlists;
using CommunityCar.Domain.Entities.Videos.Common;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace CommunityCar.Application.Features.Videos.Commands.CreatePlaylist;

public class CreatePlaylistCommandHandler : IRequestHandler<CreatePlaylistCommand, Guid>
{
    private readonly IAppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreatePlaylistCommandHandler(IAppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(CreatePlaylistCommand request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) throw new UnauthorizedAccessException();

        var playlist = new Playlist
        {
            Title = request.Title,
            Description = request.Description,
            ThumbnailUrl = request.CoverImageUrl,
            Visibility = request.IsPublic ? VideoVisibility.Public : VideoVisibility.Private,
            ChannelId = Guid.Parse(userId) // Simplified - should get actual channel
        };

        _context.Playlists.Add(playlist);
        await _context.SaveChangesAsync(cancellationToken);

        return playlist.Id;
    }
}
