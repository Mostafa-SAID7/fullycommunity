using CommunityCar.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Car> Cars => Set<Car>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).HasMaxLength(256);
        });

        modelBuilder.Entity<Car>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.LicensePlate).IsUnique();
            entity.HasOne(e => e.Owner)
                  .WithMany(u => u.Cars)
                  .HasForeignKey(e => e.OwnerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Car)
                  .WithMany(c => c.Bookings)
                  .HasForeignKey(e => e.CarId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Bookings)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
