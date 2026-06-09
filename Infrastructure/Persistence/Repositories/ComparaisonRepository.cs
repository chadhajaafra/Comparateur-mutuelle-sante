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
  public class ComparaisonRepository : IComparaisonRepository
    {
        private readonly AppDbContext _db;
        public ComparaisonRepository(AppDbContext db) => _db = db;

        private IQueryable<ComparaisonSession> WithItems() =>
            _db.ComparaisonSessions
               .Include(s => s.Items)
                   .ThenInclude(i => i.Offre)
                       .ThenInclude(o => o.Mutuelle);

        public async Task<ComparaisonSession?> GetByIdAsync(Guid id, CancellationToken ct) =>
            await WithItems().FirstOrDefaultAsync(s => s.Id == id, ct);

        public async Task<ComparaisonSession?> GetByUserIdAsync(Guid userId, CancellationToken ct) =>
            await WithItems().FirstOrDefaultAsync(s => s.UserId == userId, ct);

        public async Task<ComparaisonSession?> GetByTokenAsync(string token, CancellationToken ct) =>
            await WithItems().FirstOrDefaultAsync(s => s.SessionToken == token, ct);

        public async Task<ComparaisonSession> CreateAsync(ComparaisonSession session, CancellationToken ct)
        {
            _db.ComparaisonSessions.Add(session);
            await _db.SaveChangesAsync(ct);
            return session;
        }

        public async Task UpdateAsync(ComparaisonSession session, CancellationToken ct)
        {
            _db.ComparaisonSessions.Update(session);
            await _db.SaveChangesAsync(ct);
        }

        public async Task DeleteAsync(Guid id, CancellationToken ct)
        {
            var s = await _db.ComparaisonSessions.FindAsync(new object[] { id }, ct);
            if (s is not null) { _db.ComparaisonSessions.Remove(s); await _db.SaveChangesAsync(ct); }
        }
    }
}
