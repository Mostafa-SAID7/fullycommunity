using CommunityCar.Domain.Entities.Community.Pages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Pages;

public class PageConfiguration : IEntityTypeConfiguration<Page>
{
    public void Configure(EntityTypeBuilder<Page> builder)
    {
        builder.ToTable("Pages", "community");
        builder.HasIndex(e => e.Username).IsUnique();
        builder.HasOne(p => p.Owner)
              .WithMany()
              .HasForeignKey(p => p.OwnerId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
