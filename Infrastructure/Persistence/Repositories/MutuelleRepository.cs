using Comparateur.Domain.Entities;
using Comparateur.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Comparateur.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Infrastructure.Persistence.Repositories
{
    public class MutuelleRepository : IMutuelleRepository
    {
        private readonly AppDbContext _ctx;
        public MutuelleRepository(AppDbContext ctx) => _ctx = ctx;

        public async Task<Mutuelle?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => await _ctx.Mutuelles.FindAsync(new object[] { id }, ct);

        public async Task<Mutuelle?> GetByIdWithOffresAsync(Guid id, CancellationToken ct = default)
            => await _ctx.Mutuelles
                .Include(m => m.Offres.Where(o => o.IsActive))
                    .ThenInclude(o => o.OffreGaranties)
                        .ThenInclude(og => og.Garantie)
                .FirstOrDefaultAsync(m => m.Id == id, ct);

        public async Task<(List<Mutuelle> Items, int Total)> GetAllAsync(MutuelleFilter filter, CancellationToken ct = default)
        {
            var query = _ctx.Mutuelles
                .Include(m => m.Offres.Where(o => o.IsActive))
                    .ThenInclude(o => o.OffreGaranties)
                        .ThenInclude(og => og.Garantie)
                .AsQueryable();

            // Filtres
            if (filter.IsActive.HasValue)
                query = query.Where(m => m.IsActive == filter.IsActive);

            if (!string.IsNullOrWhiteSpace(filter.Search))
                query = query.Where(m => m.Nom.Contains(filter.Search) || m.Description.Contains(filter.Search));

            if (filter.AssureurId.HasValue)
                query = query.Where(m => m.AssureurId == filter.AssureurId);

            if (filter.Niveau.HasValue)
                query = query.Where(m => m.Offres.Any(o => o.Niveau == filter.Niveau));

            if (filter.PrixMin.HasValue)
                query = query.Where(m => m.Offres.Any(o => o.PrixMensuel >= filter.PrixMin));

            if (filter.PrixMax.HasValue)
                query = query.Where(m => m.Offres.Any(o => o.PrixMensuel <= filter.PrixMax));

            if (filter.TypeGarantie.HasValue)
                query = query.Where(m => m.Offres.Any(o =>
                    o.OffreGaranties.Any(og => og.Garantie.Type == filter.TypeGarantie)));

            var total = await query.CountAsync(ct);

            var items = await query
                .OrderBy(m => m.Nom)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(ct);

            return (items, total);
        }

        public async Task<List<Mutuelle>> GetByAssureurAsync(Guid assureurId, CancellationToken ct = default)
            => await _ctx.Mutuelles.Where(m => m.AssureurId == assureurId).ToListAsync(ct);

        public async Task CreateAsync(Mutuelle mutuelle, CancellationToken ct = default)
            => await _ctx.Mutuelles.AddAsync(mutuelle, ct);

        public Task UpdateAsync(Mutuelle mutuelle, CancellationToken ct = default)
        {
            _ctx.Mutuelles.Update(mutuelle);
            return Task.CompletedTask;
        }

        public async Task<bool> ExistsAsync(Guid id, CancellationToken ct = default)
            => await _ctx.Mutuelles.AnyAsync(m => m.Id == id, ct);
    }

    public class OffreRepository : IOffreRepository
    {
        private readonly AppDbContext _ctx;
        public OffreRepository(AppDbContext ctx) => _ctx = ctx;

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
    }

    public class GarantieRepository : IGarantieRepository
    {
        private readonly AppDbContext _ctx;
        public GarantieRepository(AppDbContext ctx) => _ctx = ctx;

        public async Task<Garantie?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => await _ctx.Garanties.FindAsync(new object[] { id }, ct);

        public async Task<List<Garantie>> GetAllAsync(CancellationToken ct = default)
            => await _ctx.Garanties.OrderBy(g => g.Type).ToListAsync(ct);

        public async Task<List<Garantie>> GetByTypeAsync(Domain.Enums.TypeGarantie type, CancellationToken ct = default)
            => await _ctx.Garanties.Where(g => g.Type == type).ToListAsync(ct);

        public async Task CreateAsync(Garantie garantie, CancellationToken ct = default)
            => await _ctx.Garanties.AddAsync(garantie, ct);

        public Task UpdateAsync(Garantie garantie, CancellationToken ct = default)
        {
            _ctx.Garanties.Update(garantie);
            return Task.CompletedTask;
        }
    }
}
