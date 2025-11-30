using CommunityCar.Application.Features.Videos.DTOs;
using MediatR;

namespace CommunityCar.Application.Features.Videos.Queries.GetVideo;

public record GetVideoQuery(Guid VideoId) : IRequest<VideoDto?>;
