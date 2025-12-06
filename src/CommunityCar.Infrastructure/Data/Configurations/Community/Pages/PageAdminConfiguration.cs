using CommunityCar.Domain.Entities.Community.Pages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Pages;

public class PageAdminConfiguration : IEntityTypeConfiguration<PageAdmin>
{
    public void Configure(EntityTypeBuilder<PageAdmin> builder)
    {
        builder.ToTable("PageAdmins", "community");
        builder.HasOne(a => a.Page)
              .WithMany(p => p.Admins)
              .HasForeignKey(a => a.PageId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(a => a.User)
              .WithMany()
              .HasForeignKey(a => a.UserId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
