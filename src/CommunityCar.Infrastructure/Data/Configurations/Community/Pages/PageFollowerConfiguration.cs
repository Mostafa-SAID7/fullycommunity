using CommunityCar.Domain.Entities.Community.Pages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Pages;

public class PageFollowerConfiguration : IEntityTypeConfiguration<PageFollower>
{
    public void Configure(EntityTypeBuilder<PageFollower> builder)
    {
        builder.ToTable("PageFollowers", "community");

        builder.HasKey(pf => pf.Id);

        builder.HasOne(pf => pf.Page)
            .WithMany(p => p.Followers)
            .HasForeignKey(pf => pf.PageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pf => pf.User)
            .WithMany()
            .HasForeignKey(pf => pf.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasIndex(pf => new { pf.PageId, pf.UserId }).IsUnique();
    }
}
