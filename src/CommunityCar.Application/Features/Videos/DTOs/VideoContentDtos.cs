namespace CommunityCar.Application.Features.Videos.DTOs;

public record CompleteUploadRequest(string VideoUrl, string? ThumbnailUrl);

public record RecordViewRequest(string? SessionId);

public record WatchProgressRequest(TimeSpan WatchDuration, double WatchPercent);


// Engagement DTOs
public record ReactRequest(CommunityCar.Domain.Entities.Videos.Common.ReactionType Type);

public record UpdateCommentRequest(string Content);

public record ShareRequest(string Platform);
