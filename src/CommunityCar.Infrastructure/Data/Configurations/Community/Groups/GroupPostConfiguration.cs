using CommunityCar.Domain.Entities.Community.Groups;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Groups;

public class GroupPostConfiguration : IEntityTypeConfiguration<GroupPost>
{
    public void Configure(EntityTypeBuilder<GroupPost> builder)
    {
        builder.ToTable("GroupPost", "community");

        builder.HasKey(gp => gp.Id);

        builder.HasOne(gp => gp.Group)
            .WithMany()
            .HasForeignKey(gp => gp.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(gp => new { gp.GroupId, gp.PostId }).IsUnique();
        builder.HasIndex(gp => gp.CreatedAt);
    }
}
