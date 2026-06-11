using CompetitionsTest.Models;
using DomainLayer.Models;
using GarasForms.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GarasForms.Core
{
    public interface IUnitOfWork : IDisposable
    {

        IBaseRepository<T, TD> GetRepository<T, TD>() where T : BaseEntity<TD>;
        IQueryable<T> GetAsNoTracking<T>() where T : class;
        Task<int> SaveChangesAsync();
    }
}
