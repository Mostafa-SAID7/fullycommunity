namespace CommunityCar.Application.Common.Pagination;

public record PaginationParams(
    int PageNumber = 1,
    int PageSize = 10
)
{
    public const int MaxPageSize = 100;

    public int PageSize { get; init; } = PageSize > MaxPageSize ? MaxPageSize : PageSize;
}
