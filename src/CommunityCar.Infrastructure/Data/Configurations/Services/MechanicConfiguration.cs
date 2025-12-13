using CommunityCar.Domain.Entities.Services.Maintenance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Services;

public class MechanicConfiguration : IEntityTypeConfiguration<Mechanic>
{
    public void Configure(EntityTypeBuilder<Mechanic> builder)
    {
        builder.ToTable("Mechanics", "services");

        builder.HasIndex(e => e.WorkshopId);
        builder.HasIndex(e => e.UserId);
        builder.HasIndex(e => e.FullName);

        builder.Property(e => e.FullName).HasMaxLength(200).IsRequired();
        builder.Property(e => e.PhotoUrl).HasMaxLength(500);
        builder.Property(e => e.Bio).HasMaxLength(2000);

        // Store lists as JSON
        builder.Property(e => e.Specialties)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<WorkshopSpecialty>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<WorkshopSpecialty>());

        builder.Property(e => e.Certifications)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>());

        builder.HasOne(e => e.Workshop)
            .WithMany(w => w.Mechanics)
            .HasForeignKey(e => e.WorkshopId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
