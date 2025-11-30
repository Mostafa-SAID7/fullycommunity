using MediatR;
using CommunityCar.Domain.Entities.Videos;

namespace CommunityCar.Application.Features.Videos.Commands.CreateVideo;

public record CreateVideoCommand(
    string Title,
    string Description,
    string VideoUrl,
    string? ThumbnailUrl,
    TimeSpan Duration,
    VideoType Type,
    bool IsLive,
    Guid? CategoryId,
    Guid? PlaylistId
) : IRequest<Guid>;
