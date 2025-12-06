using CommunityCar.Domain.Entities.Videos.Content;
using CommunityCar.Domain.Entities.Videos.Playlists;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Application.Common.Interfaces.Data;

public interface IAppDbContext
{
    DbSet<TEntity> Set<TEntity>() where TEntity : class;

    DbSet<Video> Videos { get; }
    DbSet<Playlist> Playlists { get; }
    DbSet<VideoCategory> VideoCategories { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
