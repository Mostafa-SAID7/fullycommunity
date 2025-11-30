namespace CommunityCar.Application.Features.Marketplace.Reviews;

public record ProductReviewDto(
    Guid Id,
    Guid ProductId,
    Guid ReviewerId,
    string ReviewerName,
    Guid? OrderId,
    int Rating,
    string? Title,
    string? Comment,
    int? QualityRating,
    int? ValueRating,
    int? AccuracyRating,
    List<string> PhotoUrls,
    bool IsVerifiedPurchase,
    bool IsRecommended,
    string? SellerResponse,
    DateTime? RespondedAt,
    int HelpfulCount,
    int NotHelpfulCount,
    DateTime CreatedAt
);

public record CreateProductReviewRequest(
    Guid ProductId,
    Guid? OrderId,
    int Rating,
    string? Title,
    string? Comment,
    int? QualityRating,
    int? ValueRating,
    int? AccuracyRating,
    List<string>? PhotoUrls,
    bool IsRecommended
);

public record SellerReviewDto(
    Guid Id,
    Guid SellerId,
    string SellerName,
    Guid ReviewerId,
    string ReviewerName,
    Guid OrderId,
    int Rating,
    string? Comment,
    int? CommunicationRating,
    int? ShippingSpeedRating,
    int? ItemAsDescribedRating,
    bool IsRecommended,
    string? SellerResponse,
    DateTime? RespondedAt,
    DateTime CreatedAt
);

public record CreateSellerReviewRequest(
    Guid SellerId,
    Guid OrderId,
    int Rating,
    string? Comment,
    int? CommunicationRating,
    int? ShippingSpeedRating,
    int? ItemAsDescribedRating,
    bool IsRecommended
);

public record RespondToReviewRequest(string Response);

public record ReviewSummaryDto(
    double AverageRating,
    int TotalReviews,
    int FiveStarCount,
    int FourStarCount,
    int ThreeStarCount,
    int TwoStarCount,
    int OneStarCount,
    double RecommendedPercent
);
