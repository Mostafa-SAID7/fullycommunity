using CommunityCar.Domain.Entities.Community.News;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.News;

public class NewsTagConfiguration : IEntityTypeConfiguration<NewsTag>
{
    public void Configure(EntityTypeBuilder<NewsTag> builder)
    {
        builder.ToTable("NewsTags", "community");
        builder.HasOne(t => t.Article)
              .WithMany(a => a.Tags)
              .HasForeignKey(t => t.ArticleId)
              .OnDelete(DeleteBehavior.Cascade);
    }
}
