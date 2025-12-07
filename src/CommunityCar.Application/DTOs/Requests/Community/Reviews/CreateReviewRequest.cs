using CommunityCar.Domain.Entities.Community.Reviews;
using CommunityCar.Domain.Enums.Community.Reviews;

namespace CommunityCar.Application.DTOs.Requests.Community.Reviews;

public record CreateReviewRequest(
    string Title,
    string Content,
    ReviewSubjectType SubjectType,
    string? SubjectId,
    string? CarMake,
    string? CarModel,
    int? CarYear,
    string? CarTrim,
    OwnershipStatus? OwnershipStatus,
    int? OwnershipMonths,
    int? MilesDriven,
    int OverallRating,
    int? PerformanceRating,
    int? ComfortRating,
    int? ReliabilityRating,
    int? ValueRating,
    int? FuelEconomyRating,
    int? StyleRating,
    int? TechnologyRating,
    List<string>? Pros,
    List<string>? Cons
);
