namespace CommunityCar.Application.DTOs.Requests.Marketplace;

public record AuctionSearchRequest(
    string? Category,
    decimal? MinPrice,
    decimal? MaxPrice,
    string? Status,
    int Page = 1,
    int PageSize = 10
);

public record CreateListingRequest(
    string Title,
    string Description,
    decimal Price,
    string Category,
    string Condition,
    List<string> Images
);

public record UpdateListingRequest(
    string Title,
    string Description,
    decimal Price,
    string Condition
);

public record PlaceBidRequest(
    decimal Amount
);

public record CreateReportRequest(
    Guid ListingId,
    string Reason,
    string? Details
);

public record CreateAuctionRequest(
    Guid ListingId,
    decimal StartingPrice,
    DateTime StartTime,
    DateTime EndTime
);
