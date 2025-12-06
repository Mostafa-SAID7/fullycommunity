using CommunityCar.Domain.Entities.Community.Pages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Pages;

public class PageFollowerConfiguration : IEntityTypeConfiguration<PageFollower>
{
    public void Configure(EntityTypeBuilder<PageFollower> builder)
    {
        builder.ToTable("PageFollowers", "community");
        builder.HasOne(f => f.Page)
              .WithMany(p => p.Followers)
              .HasForeignKey(f => f.PageId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(f => f.User)
              .WithMany()
              .HasForeignKey(f => f.UserId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
