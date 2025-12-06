using CommunityCar.Domain.Entities.Community.Posts;

namespace CommunityCar.Application.DTOs.Requests.Community.Posts;

public record CreatePostRequest(
    string Title,
    string Content,
    PostType Type = PostType.General,
    string Visibility = "Public",
    Guid? CategoryId = null,
    List<string>? Tags = null,
    Guid? GroupId = null,
    List<string>? MediaUrls = null
);
