using CommunityCar.Domain.Entities.Videos;
using CommunityCar.Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace CommunityCar.Application.Features.Videos.Commands.CreateVideo;

public class CreateVideoCommandHandler : IRequestHandler<CreateVideoCommand, Guid>
{
    private readonly IAppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateVideoCommandHandler(IAppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(CreateVideoCommand request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) throw new UnauthorizedAccessException();

        var video = new Video
        {
            Title = request.Title,
            Description = request.Description,
            VideoUrl = request.VideoUrl,
            ThumbnailUrl = request.ThumbnailUrl,
            Duration = request.Duration,
            Type = request.Type,
            IsLive = request.IsLive,
            CategoryId = request.CategoryId,
            PlaylistId = request.PlaylistId,
            AuthorId = Guid.Parse(userId)
        };

        _context.Videos.Add(video);
        await _context.SaveChangesAsync(cancellationToken);

        return video.Id;
    }
}
