namespace CommunityCar.Application.Common.Pagination;

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;

    public PagedResult() { }

    public PagedResult(IEnumerable<T> items, int page, int pageSize, int totalCount)
    {
        Items = items;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
    }

    public static PagedResult<T> Create(IEnumerable<T> items, int page, int pageSize, int totalCount)
        => new(items, page, pageSize, totalCount);

    public static PagedResult<T> Empty(int page = 1, int pageSize = 20)
        => new([], page, pageSize, 0);
}

public static class PagedResultExtensions
{
    public static PagedResult<TDestination> Map<TSource, TDestination>(
        this PagedResult<TSource> source,
        Func<TSource, TDestination> mapper)
    {
        return new PagedResult<TDestination>(
            source.Items.Select(mapper),
            source.Page,
            source.PageSize,
            source.TotalCount
        );
    }
}
