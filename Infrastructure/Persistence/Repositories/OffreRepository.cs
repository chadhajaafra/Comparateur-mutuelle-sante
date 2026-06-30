using Comparateur.Domain.Entities;
using Comparateur.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Infrastructure.Persistence.Repositories
{
    public class OffreRepository : IOffreRepository
    {
        private readonly AppDbContext _ctx;
        public OffreRepository(AppDbContext ctx) => _ctx = ctx;
        private IQueryable<ComparaisonSession> WithItems() =>
       _ctx.ComparaisonSessions
       .Include(s => s.Items)
           .ThenInclude(i => i.Offre)
               .ThenInclude(o => o.Mutuelle)
       .Include(s => s.Items)                          // ← ajout
           .ThenInclude(i => i.Offre)
               .ThenInclude(o => o.OffreGaranties)
                   .ThenInclude(og => og.Garantie);
        public async Task<Offre?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => await _ctx.Offres.FindAsync(new object[] { id }, ct);

        public async Task<Offre?> GetByIdWithGarantiesAsync(Guid id, CancellationToken ct = default)
            => await _ctx.Offres
                .Include(o => o.OffreGaranties).ThenInclude(og => og.Garantie)
                .FirstOrDefaultAsync(o => o.Id == id, ct);

        public async Task<List<Offre>> GetByMutuelleAsync(Guid mutuelleId, CancellationToken ct = default)
            => await _ctx.Offres
                .Include(o => o.OffreGaranties).ThenInclude(og => og.Garantie)
                .Where(o => o.MutuelleId == mutuelleId && o.IsActive)
                .ToListAsync(ct);

        public async Task CreateAsync(Offre offre, CancellationToken ct = default)
            => await _ctx.Offres.AddAsync(offre, ct);

        public Task UpdateAsync(Offre offre, CancellationToken ct = default)
        {
            _ctx.Offres.Update(offre);
            return Task.CompletedTask;
        }
        public async Task<List<Offre>> GetAllActiveWithGarantiesAsync(string? search, int? niveau, List<int>? typesGarantie, CancellationToken ct)
        {
            var q = _ctx.Offres
                .Include(o => o.Mutuelle)
                .Include(o => o.OffreGaranties)
                    .ThenInclude(og => og.Garantie)
                .Where(o => o.IsActive && o.Mutuelle.IsActive)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                q = q.Where(o => o.Nom.Contains(search) || o.Mutuelle.Nom.Contains(search));

            if (niveau.HasValue)
                q = q.Where(o => (int)o.Niveau == niveau.Value);

            if (typesGarantie is { Count: > 0 })
                q = q.Where(o => o.OffreGaranties
                    .Any(og => typesGarantie.Contains((int)og.Garantie.Type)));

            return await q.ToListAsync(ct);
        }
    }
}
