namespace CommunityCar.API.Models.Requests;

public record PaginationRequest(
    int Page = 1,
    int PageSize = 20,
    string? SortBy = null,
    bool SortDescending = false
)
{
    public int Skip => (Page - 1) * PageSize;
    public int Take => PageSize;
}

public record SearchRequest(
    string? Query = null,
    int Page = 1,
    int PageSize = 20,
    string? SortBy = null,
    bool SortDescending = false
) : PaginationRequest(Page, PageSize, SortBy, SortDescending);

public record DateRangeRequest(
    DateTime? From = null,
    DateTime? To = null,
    int Page = 1,
    int PageSize = 20
) : PaginationRequest(Page, PageSize);
