using Application.Common;
using Comparateur.Application.Common;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Auth.Commands
{
    // ── RefreshToken ───────────────────────────────────────────────────────────
    public record RefreshTokenCommand(string AccessToken, string RefreshToken) : IRequest<AuthResult>;

    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResult>
    {
        private readonly IUserRepository _userRepo;
        private readonly IRefreshTokenRepository _refreshTokenRepo;
        private readonly IUnitOfWork _uow;
        private readonly ITokenService _tokenService;

        public RefreshTokenCommandHandler(IUserRepository userRepo, IRefreshTokenRepository refreshTokenRepo, IUnitOfWork uow, ITokenService tokenService)
        {
            _userRepo = userRepo; _refreshTokenRepo = refreshTokenRepo; _uow = uow; _tokenService = tokenService;
        }

        public async Task<AuthResult> Handle(RefreshTokenCommand request, CancellationToken ct)
        {
            var principal = _tokenService.GetPrincipalFromToken(request.AccessToken)
                ?? throw new UnauthorizedException("Token invalide.");

            var userId = Guid.Parse(principal.FindFirst("sub")?.Value ?? throw new UnauthorizedException());
            var user = await _userRepo.GetByIdAsync(userId, ct)
                ?? throw new NotFoundException(nameof(User), userId);

            var storedToken = await _refreshTokenRepo.GetByTokenAsync(request.RefreshToken, ct)
                ?? throw new UnauthorizedException("Refresh token invalide.");

            if (!storedToken.IsActive() || storedToken.UserId != userId)
                throw new UnauthorizedException("Refresh token expiré ou révoqué.");

            // Rotation du token
            storedToken.Revoke();
            var newRefreshValue = _tokenService.GenerateRefreshToken();
            var newRefresh = RefreshToken.Create(user.Id, newRefreshValue);
            await _refreshTokenRepo.UpdateAsync(storedToken, ct);
            await _refreshTokenRepo.CreateAsync(newRefresh, ct);
            await _uow.SaveChangesAsync(ct);

            var newAccess = _tokenService.GenerateAccessToken(user);
            return new AuthResult(newAccess, newRefreshValue, DateTime.UtcNow.AddMinutes(15), user.Role.ToString(), user.Id);
        }
    }
}
