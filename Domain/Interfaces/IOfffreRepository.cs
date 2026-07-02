using Comparateur.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Interfaces
{

        public interface IOffreRepository
        {
            Task<List<Offre>> GetAllActiveWithGarantiesAsync(string? search, int? niveau, List<int>? typesGarantie, CancellationToken ct);
            Task<Offre?> GetByIdAsync(Guid id, CancellationToken ct = default);
            Task<Offre?> GetByIdWithGarantiesAsync(Guid id, CancellationToken ct = default);
            Task<List<Offre>> GetByMutuelleAsync(Guid mutuelleId, CancellationToken ct = default);
            Task CreateAsync(Offre offre, CancellationToken ct = default);
            Task UpdateAsync(Offre offre, CancellationToken ct = default);
            Task<IEnumerable<Offre>> GetActiveOffresAsync(CancellationToken ct);
        }
    
}
