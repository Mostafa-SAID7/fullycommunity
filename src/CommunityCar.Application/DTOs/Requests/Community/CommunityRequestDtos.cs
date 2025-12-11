namespace CommunityCar.Application.DTOs.Requests.Community;

public record CreateCommentRequest(
    string Content,
    Guid? ParentId
);

public record CreateAnnouncementRequest(
    string Title,
    string Content,
    string Type,
    DateTime? ExpiresAt
);

public record CommentSearchRequest(
    Guid? PostId,
    Guid? AuthorId,
    int Page = 1,
    int PageSize = 20
);

public record CreateEventRequest(
    string Title,
    string Description,
    DateTime StartDate,
    DateTime EndDate,
    string Location
);

public record CreateGroupRequest(
    string Name,
    string Description,
    bool IsPrivate
);

public record CreatePostRequest(
    string Content,
    List<string>? Images
);

public record CreateGuideRequest(
    string Title,
    string Content,
    string Category
);
