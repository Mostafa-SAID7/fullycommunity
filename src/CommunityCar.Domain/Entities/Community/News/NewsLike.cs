using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.News;

public class NewsLike
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid NewsArticleId { get; set; }
    public NewsArticle NewsArticle { get; set; } = null!;
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
