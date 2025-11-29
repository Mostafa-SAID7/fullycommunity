namespace CommunityCar.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    Task<int> SaveChangesAsync();
}
