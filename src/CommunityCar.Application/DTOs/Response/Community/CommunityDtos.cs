namespace CommunityCar.Application.DTOs.Response.Community;

public record CommentDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatar,
    string Content,
    int LikeCount,
    DateTime CreatedAt
);

public record AnnouncementDto(
    Guid Id,
    string Title,
    string Content,
    string Type,
    DateTime CreatedAt,
    DateTime? ExpiresAt
);

public record EventDto(
    Guid Id,
    string Title,
    string Description,
    DateTime StartDate,
    DateTime EndDate,
    string Location,
    int AttendeeCount,
    string Status
);

public record GroupDto(
    Guid Id,
    string Name,
    string Description,
    string? AvatarUrl,
    int MemberCount,
    bool IsPrivate,
    DateTime CreatedAt
);

public record PostDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string Content,
    List<string>? Images,
    int LikeCount,
    int CommentCount,
    DateTime CreatedAt
);

public record GuideDto(
    Guid Id,
    string Title,
    string Content,
    string Category,
    int ViewCount,
    DateTime CreatedAt
);
