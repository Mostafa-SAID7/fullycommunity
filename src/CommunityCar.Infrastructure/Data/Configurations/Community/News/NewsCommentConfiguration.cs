using CommunityCar.Domain.Entities.Community.News;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.News;

public class NewsCommentConfiguration : IEntityTypeConfiguration<NewsComment>
{
    public void Configure(EntityTypeBuilder<NewsComment> builder)
    {
        builder.ToTable("NewsComments", "community");

        builder.HasKey(nc => nc.Id);

        builder.HasOne(nc => nc.Article)
            .WithMany(a => a.Comments)
            .HasForeignKey(nc => nc.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(nc => nc.Author)
            .WithMany()
            .HasForeignKey(nc => nc.AuthorId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(nc => nc.Parent)
            .WithMany()
            .HasForeignKey(nc => nc.ParentId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
