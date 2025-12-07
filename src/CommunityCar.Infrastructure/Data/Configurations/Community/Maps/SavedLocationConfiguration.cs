using CommunityCar.Domain.Entities.Community.Maps;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Maps;

public class SavedLocationConfiguration : IEntityTypeConfiguration<SavedLocation>
{
    public void Configure(EntityTypeBuilder<SavedLocation> builder)
    {
        builder.ToTable("SavedLocations", "community");

        builder.HasKey(sl => sl.Id);

        builder.HasOne(sl => sl.Location)
            .WithMany()
            .HasForeignKey(sl => sl.LocationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(sl => sl.User)
            .WithMany()
            .HasForeignKey(sl => sl.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasIndex(sl => new { sl.LocationId, sl.UserId }).IsUnique();
    }
}
