namespace CommunityCar.Application.DTOs.Requests.Community.Posts;

public record CreateCommentRequest(
    string Content,
    Guid? ParentId = null
);
