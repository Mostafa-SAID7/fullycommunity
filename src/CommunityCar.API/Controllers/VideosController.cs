using CommunityCar.Application.Features.Videos.Commands.CreatePlaylist;
using CommunityCar.Application.Features.Videos.Commands.CreateVideo;
using CommunityCar.Application.Features.Videos.Queries.GetVideo;
using CommunityCar.Application.Features.Videos.Queries.GetVideos;
using CommunityCar.Application.Features.Videos.Queries.GetPlaylist;
using CommunityCar.Application.Features.Videos.DTOs;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Domain.Entities.Videos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VideosController : ControllerBase
{
    private readonly IMediator _mediator;

    public VideosController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/videos
    [HttpGet]
    public async Task<ActionResult<PagedResult<VideoListDto>>> GetVideos(
        [FromQuery] VideoType? type = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] Guid? authorId = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = new GetVideosQuery(type, categoryId, authorId, page, pageSize);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // GET: api/videos/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VideoDto>> GetVideo(Guid id)
    {
        var query = new GetVideoQuery(id);
        var result = await _mediator.Send(query);
        return result is null ? NotFound() : Ok(result);
    }

    // POST: api/videos
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Guid>> CreateVideo(CreateVideoCommand command)
    {
        var videoId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetVideo), new { id = videoId }, videoId);
    }

    // GET: api/videos/playlists/{id}
    [HttpGet("playlists/{id:guid}")]
    public async Task<ActionResult<PlaylistDto>> GetPlaylist(Guid id)
    {
        var query = new GetPlaylistQuery(id);
        var result = await _mediator.Send(query);
        return result is null ? NotFound() : Ok(result);
    }

    // POST: api/videos/playlists
    [HttpPost("playlists")]
    [Authorize]
    public async Task<ActionResult<Guid>> CreatePlaylist(CreatePlaylistCommand command)
    {
        var playlistId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetPlaylist), new { id = playlistId }, playlistId);
    }
}
