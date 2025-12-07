using CommunityCar.Domain.Entities.Community.Friendships;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Friendships;

public class UserFollowConfiguration : IEntityTypeConfiguration<UserFollow>
{
    public void Configure(EntityTypeBuilder<UserFollow> builder)
    {
        builder.ToTable("UserFollows", "community");

        builder.HasKey(uf => uf.Id);

        // Configure relationships with NO ACTION to avoid cascade cycles
        builder.HasOne(uf => uf.Follower)
            .WithMany()
            .HasForeignKey(uf => uf.FollowerId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(uf => uf.Following)
            .WithMany()
            .HasForeignKey(uf => uf.FollowingId)
            .OnDelete(DeleteBehavior.NoAction);

        // Indexes
        builder.HasIndex(uf => new { uf.FollowerId, uf.FollowingId }).IsUnique();
        builder.HasIndex(uf => uf.CreatedAt);
    }
}
