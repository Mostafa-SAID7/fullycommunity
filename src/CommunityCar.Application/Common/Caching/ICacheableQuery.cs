namespace CommunityCar.Application.Common.Caching;

public interface ICacheableQuery
{
    string CacheKey { get; }
    TimeSpan? CacheDuration { get; }
    bool BypassCache { get; }
}
