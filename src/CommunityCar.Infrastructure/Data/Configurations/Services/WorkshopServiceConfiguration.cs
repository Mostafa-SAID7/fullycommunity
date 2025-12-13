using CommunityCar.Domain.Entities.Services.Maintenance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Services;

public class WorkshopServiceConfiguration : IEntityTypeConfiguration<WorkshopService>
{
    public void Configure(EntityTypeBuilder<WorkshopService> builder)
    {
        builder.ToTable("WorkshopServices", "services");

        builder.HasIndex(e => e.WorkshopId);
        builder.HasIndex(e => e.Category);

        builder.Property(e => e.Name).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Description).HasMaxLength(2000);
        builder.Property(e => e.BasePrice).HasPrecision(18, 2);
        builder.Property(e => e.MaxPrice).HasPrecision(18, 2);
        builder.Property(e => e.WarrantyTerms).HasMaxLength(1000);

        builder.HasOne(e => e.Workshop)
            .WithMany(w => w.Services)
            .HasForeignKey(e => e.WorkshopId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
