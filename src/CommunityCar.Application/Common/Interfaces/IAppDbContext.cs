using CommunityCar.Domain.Entities.Videos;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<TEntity> Set<TEntity>() where TEntity : class;

    DbSet<Video> Videos { get; }
    DbSet<Playlist> Playlists { get; }
    DbSet<VideoCategory> VideoCategories { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
