using CommunityCar.Domain.Entities.Community.News;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.News;

public class NewsLikeConfiguration : IEntityTypeConfiguration<NewsLike>
{
    public void Configure(EntityTypeBuilder<NewsLike> builder)
    {
        builder.ToTable("NewsLikes", "community");

        builder.HasKey(nl => nl.Id);

        builder.HasOne(nl => nl.NewsArticle)
            .WithMany()
            .HasForeignKey(nl => nl.NewsArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(nl => nl.User)
            .WithMany()
            .HasForeignKey(nl => nl.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasIndex(nl => new { nl.NewsArticleId, nl.UserId }).IsUnique();
    }
}
