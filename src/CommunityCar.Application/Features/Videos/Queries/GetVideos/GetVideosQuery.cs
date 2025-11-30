using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Videos.DTOs;
using CommunityCar.Domain.Entities.Videos;
using MediatR;

namespace CommunityCar.Application.Features.Videos.Queries.GetVideos;

public record GetVideosQuery(
    VideoType? Type = null,
    Guid? CategoryId = null,
    Guid? AuthorId = null,
    int Page = 1,
    int PageSize = 20
) : IRequest<PagedResult<VideoListDto>>;
