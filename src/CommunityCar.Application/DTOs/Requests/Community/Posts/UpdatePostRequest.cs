using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Enums.Community.Posts;

namespace CommunityCar.Application.DTOs.Requests.Community.Posts;

public record UpdatePostRequest(
    string? Title = null,
    string? Content = null,
    PostType? Type = null,
    string? Visibility = null,
    Guid? CategoryId = null,
    List<string>? Tags = null,
    List<string>? MediaUrls = null
);
