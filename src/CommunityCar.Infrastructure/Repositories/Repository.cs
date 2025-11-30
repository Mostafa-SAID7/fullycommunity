using System.Linq.Expressions;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Specifications;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) 
        => await _dbSet.FindAsync(new object[] { id }, cancellationToken);

    public async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default) 
        => await _dbSet.FindAsync(new object[] { id }, cancellationToken);

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default) 
        => await _dbSet.ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default) 
        => await _dbSet.Where(predicate).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<T>> GetAsync(ISpecification<T> spec, CancellationToken cancellationToken = default)
        => await ApplySpecification(spec).ToListAsync(cancellationToken);

    public async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default)
        => predicate == null ? await _dbSet.CountAsync(cancellationToken) : await _dbSet.CountAsync(predicate, cancellationToken);

    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
        => await _dbSet.AnyAsync(predicate, cancellationToken);

    public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
        => await _dbSet.FirstOrDefaultAsync(predicate, cancellationToken);

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        return entity;
    }

    public async Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
        => await _dbSet.AddRangeAsync(entities, cancellationToken);

    public void Update(T entity) => _dbSet.Update(entity);

    public void Delete(T entity) => _dbSet.Remove(entity);

    public void DeleteRange(IEnumerable<T> entities) => _dbSet.RemoveRange(entities);

    private IQueryable<T> ApplySpecification(ISpecification<T> spec)
    {
        var query = _dbSet.AsQueryable();
        if (spec.Criteria != null)
            query = query.Where(spec.Criteria);
        return query;
    }
}
