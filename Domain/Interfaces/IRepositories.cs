using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
  public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User?> GetByEmailVerificationTokenAsync(string token, CancellationToken ct = default);
    Task<User?> GetByPasswordResetTokenAsync(string token, CancellationToken ct = default);
    Task<bool> ExistsAsync(string email, CancellationToken ct = default);
    Task CreateAsync(User user, CancellationToken ct = default);
    Task UpdateAsync(User user, CancellationToken ct = default);
}

    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default);
        Task<List<RefreshToken>> GetActiveTokensByUserAsync(Guid userId, CancellationToken ct = default);
        Task CreateAsync(RefreshToken token, CancellationToken ct = default);
        Task UpdateAsync(RefreshToken token, CancellationToken ct = default);
        Task RevokeAllUserTokensAsync(Guid userId, CancellationToken ct = default);
    }

    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync(CancellationToken ct = default);
    }
}