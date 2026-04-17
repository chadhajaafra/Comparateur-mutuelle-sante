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
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _ctx;
        public UserRepository(AppDbContext ctx) => _ctx = ctx;

        public async Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => await _ctx.Users.FindAsync(new object[] { id }, ct);

        public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
            => await _ctx.Users.FirstOrDefaultAsync(u => u.Email == email.ToLower().Trim(), ct);

        public async Task<User?> GetByEmailVerificationTokenAsync(string token, CancellationToken ct = default)
            => await _ctx.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token, ct);

        public async Task<User?> GetByPasswordResetTokenAsync(string token, CancellationToken ct = default)
            => await _ctx.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == token, ct);

        public async Task<bool> ExistsAsync(string email, CancellationToken ct = default)
            => await _ctx.Users.AnyAsync(u => u.Email == email.ToLower().Trim(), ct);

        public async Task CreateAsync(User user, CancellationToken ct = default)
            => await _ctx.Users.AddAsync(user, ct);

        public Task UpdateAsync(User user, CancellationToken ct = default)
        {
            _ctx.Users.Update(user);
            return Task.CompletedTask;
        }
    }
}
