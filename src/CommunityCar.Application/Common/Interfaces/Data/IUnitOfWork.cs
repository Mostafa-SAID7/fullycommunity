namespace CommunityCar.Application.Common.Interfaces.Data;

/// <summary>
/// Unit of Work pattern for managing database transactions and repositories
/// </summary>
public interface IUnitOfWork : IDisposable
{
    // Transaction Management
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    
    // Repository Access
    IRepository<TEntity> Repository<TEntity>() where TEntity : class;
    
    // Bulk Operations
    Task<int> ExecuteSqlRawAsync(string sql, CancellationToken cancellationToken = default);
    Task<int> ExecuteSqlRawAsync(string sql, params object[] parameters);
}
