using CommunityCar.Domain.Entities.Services.Expert;
using CommunityCar.Domain.Entities.Services.Maintenance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Services;

public class ExpertConfiguration : IEntityTypeConfiguration<Expert>
{
    public void Configure(EntityTypeBuilder<Expert> builder)
    {
        builder.ToTable("Experts", "services");

        builder.HasIndex(e => e.FullName);
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.AverageRating);
        builder.HasIndex(e => e.UserId);

        builder.Property(e => e.FullName).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Title).HasMaxLength(200);
        builder.Property(e => e.Bio).HasMaxLength(2000);
        builder.Property(e => e.PhotoUrl).HasMaxLength(500);
        builder.Property(e => e.ChatRatePerMin).HasPrecision(18, 2);
        builder.Property(e => e.VoiceRatePerMin).HasPrecision(18, 2);
        builder.Property(e => e.VideoRatePerMin).HasPrecision(18, 2);

        // Store lists as JSON
        builder.Property(e => e.Specialties)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<WorkshopSpecialty>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<WorkshopSpecialty>());

        builder.Property(e => e.BrandsExpertise)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>());

        builder.Property(e => e.Certifications)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>());

        builder.Property(e => e.Languages)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>());
    }
}
