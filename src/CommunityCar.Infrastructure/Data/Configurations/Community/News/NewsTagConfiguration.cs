using CommunityCar.Domain.Entities.Community.News;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.News;

public class NewsTagConfiguration : IEntityTypeConfiguration<NewsTag>
{
    public void Configure(EntityTypeBuilder<NewsTag> builder)
    {
        builder.ToTable("NewsTags", "community");

        builder.HasKey(nt => nt.Id);

        builder.HasOne(nt => nt.Article)
            .WithMany(a => a.Tags)
            .HasForeignKey(nt => nt.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
