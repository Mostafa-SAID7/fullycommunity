using CommunityCar.Application.Features.Videos.DTOs;
using MediatR;

namespace CommunityCar.Application.Features.Videos.Queries.GetPlaylist;

public record GetPlaylistQuery(Guid PlaylistId) : IRequest<PlaylistDto?>;
