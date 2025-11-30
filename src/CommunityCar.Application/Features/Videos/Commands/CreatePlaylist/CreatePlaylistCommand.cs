using MediatR;

namespace CommunityCar.Application.Features.Videos.Commands.CreatePlaylist;

public record CreatePlaylistCommand(
    string Title,
    string Description,
    string? CoverImageUrl,
    bool IsPublic
) : IRequest<Guid>;
