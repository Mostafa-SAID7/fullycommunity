using CommunityCar.Domain.Entities.Community.Reviews;

namespace CommunityCar.Application.DTOs.Requests.Community.Reviews;

public record UpdateReviewRequest(
    string? Title,
    string? Content,
    int? OverallRating,
    int? PerformanceRating,
    int? ComfortRating,
    int? ReliabilityRating,
    int? ValueRating,
    List<string>? Pros,
    List<string>? Cons,
    ReviewStatus? Status
);
