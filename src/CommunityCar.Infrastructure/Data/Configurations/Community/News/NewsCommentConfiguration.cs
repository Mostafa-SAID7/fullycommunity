using CommunityCar.Domain.Entities.Community.News;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.News;

public class NewsCommentConfiguration : IEntityTypeConfiguration<NewsComment>
{
    public void Configure(EntityTypeBuilder<NewsComment> builder)
    {
        builder.ToTable("NewsComments", "community");
        builder.HasOne(c => c.Article)
              .WithMany(a => a.Comments)
              .HasForeignKey(c => c.ArticleId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
