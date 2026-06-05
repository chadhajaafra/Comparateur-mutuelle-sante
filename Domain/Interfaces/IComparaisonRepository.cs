using Comparateur.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Interfaces
{
    public interface IComparaisonRepository
    {
        Task<ComparaisonSession?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<ComparaisonSession?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task<ComparaisonSession?> GetByTokenAsync(string token, CancellationToken ct = default);
        Task<ComparaisonSession> CreateAsync(ComparaisonSession session, CancellationToken ct = default);
        Task UpdateAsync(ComparaisonSession session, CancellationToken ct = default);
        Task DeleteAsync(Guid id, CancellationToken ct = default);
    }
}
