using CommunityCar.Domain.Entities.Community.News;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.News;

public class NewsArticleConfiguration : IEntityTypeConfiguration<NewsArticle>
{
    public void Configure(EntityTypeBuilder<NewsArticle> builder)
    {
        builder.ToTable("NewsArticles", "community");

        builder.HasKey(na => na.Id);

        builder.HasIndex(na => na.Slug).IsUnique();

        builder.HasOne(na => na.Author)
            .WithMany()
            .HasForeignKey(na => na.AuthorId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(na => na.Category)
            .WithMany()
            .HasForeignKey(na => na.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
