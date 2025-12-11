namespace CommunityCar.Application.DTOs.Requests.Videos;

public record CreateVideoCollectionRequest(
    string Name,
    string? Description,
    bool IsPublic
);

public record CreateShareRequest(
    string Platform,
    string? Message
);

public record CommentSearchRequest(
    Guid? ParentId,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateCommentRequest(
    Guid VideoId,
    string Content,
    Guid? ParentId
);

public record AddToCollectionRequest(
    Guid VideoId,
    Guid? CollectionId
);

public record CreateCollectionRequest(
    string Name,
    string? Description,
    bool IsPrivate
);

