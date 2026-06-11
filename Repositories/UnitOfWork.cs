using CompetitionsTest.Data;
using DomainLayer.Models;
using GarasForms.Core;
using GarasForms.Core.Interfaces;
using GarasForms.EntityFrameworkCore.Repositories;
using Microsoft.EntityFrameworkCore;


namespace GarasForms.EntityFrameworkCore
{
    public class UnitOfWork(ApplicationDbContext _context) : IUnitOfWork
    {
        //Dynamic repository factory method
        private readonly Dictionary<Type, object> _repositories = [];
        public IBaseRepository<T, TD> GetRepository<T, TD>() where T : BaseEntity<TD>
        {
            var entityType = typeof(T);
            if (_repositories.TryGetValue(entityType, out object? repo)) 
                return (IBaseRepository<T, TD>)repo; 

            else
            {
                var repository = new BaseRepository<T, TD>(_context);
                _repositories.Add(entityType, repository);
                return repository;
            }
        }

        // Save Changes method
        public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

        public void Dispose()
        {
            _context.Dispose();
        }
        public IQueryable<T> GetAsNoTracking<T>() where T : class
        {
            return _context.Set<T>().AsNoTracking();
        }

    }
}
