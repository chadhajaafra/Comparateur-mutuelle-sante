using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Infrastructure.Persistence.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly AppDbContext _ctx;
        public RefreshTokenRepository(AppDbContext ctx) => _ctx = ctx;

        public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default)
            => await _ctx.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == token, ct);

        public async Task<List<RefreshToken>> GetActiveTokensByUserAsync(Guid userId, CancellationToken ct = default)
            => await _ctx.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked && rt.ExpiresAt > DateTime.UtcNow)
                .ToListAsync(ct);

        public async Task CreateAsync(RefreshToken token, CancellationToken ct = default)
            => await _ctx.RefreshTokens.AddAsync(token, ct);

        public Task UpdateAsync(RefreshToken token, CancellationToken ct = default)
        {
            _ctx.RefreshTokens.Update(token);
            return Task.CompletedTask;
        }

        public async Task RevokeAllUserTokensAsync(Guid userId, CancellationToken ct = default)
        {
            var tokens = await GetActiveTokensByUserAsync(userId, ct);
            tokens.ForEach(t => t.Revoke());
        }
    }

}
