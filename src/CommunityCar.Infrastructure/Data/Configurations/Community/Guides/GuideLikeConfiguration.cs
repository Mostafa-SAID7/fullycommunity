using CommunityCar.Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Guides;

public class GuideLikeConfiguration : IEntityTypeConfiguration<GuideLike>
{
    public void Configure(EntityTypeBuilder<GuideLike> builder)
    {
        builder.ToTable("GuideLikes", "community");

        builder.HasKey(gl => gl.Id);

        builder.HasOne(gl => gl.Guide)
            .WithMany()
            .HasForeignKey(gl => gl.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(gl => gl.User)
            .WithMany()
            .HasForeignKey(gl => gl.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasIndex(gl => new { gl.GuideId, gl.UserId }).IsUnique();
    }
}
