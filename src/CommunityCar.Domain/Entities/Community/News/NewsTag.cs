namespace CommunityCar.Domain.Entities.Community.News;

public class NewsTag
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ArticleId { get; set; }
    public NewsArticle Article { get; set; } = null!;
    public string Tag { get; set; } = string.Empty;
}
