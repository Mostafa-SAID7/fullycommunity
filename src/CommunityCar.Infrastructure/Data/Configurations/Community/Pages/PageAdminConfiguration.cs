using CommunityCar.Domain.Entities.Community.Pages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Pages;

public class PageAdminConfiguration : IEntityTypeConfiguration<PageAdmin>
{
    public void Configure(EntityTypeBuilder<PageAdmin> builder)
    {
        builder.ToTable("PageAdmins", "community");

        builder.HasKey(pa => pa.Id);

        builder.HasOne(pa => pa.Page)
            .WithMany(p => p.Admins)
            .HasForeignKey(pa => pa.PageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pa => pa.User)
            .WithMany()
            .HasForeignKey(pa => pa.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasIndex(pa => new { pa.PageId, pa.UserId }).IsUnique();
    }
}
