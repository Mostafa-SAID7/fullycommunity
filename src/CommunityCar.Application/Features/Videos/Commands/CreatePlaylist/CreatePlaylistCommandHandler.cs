using CommunityCar.Domain.Entities.Videos;
using CommunityCar.Application.Common.Interfaces;
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
            CoverImageUrl = request.CoverImageUrl,
            IsPublic = request.IsPublic,
            CreatorId = Guid.Parse(userId)
        };

        _context.Playlists.Add(playlist);
        await _context.SaveChangesAsync(cancellationToken);

        return playlist.Id;
    }
}
