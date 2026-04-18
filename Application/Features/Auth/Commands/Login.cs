using Application.Common;
using Comparateur.Application.Common;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using FluentValidation;
//using BCrypt.Net;
using MediatR;
namespace Comparateur.Application.Features.Auth.Commands
{
    // ── Command ────────────────────────────────────────────────────────────────
    public record LoginCommand(string Email, string Password) : IRequest<AuthResult>;

    // ── Validator ────────────────────────────────────────────-─────────────────
    public class LoginCommandValidator : AbstractValidator<LoginCommand>
    {
        public LoginCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("L'email est requis.")
                .EmailAddress().WithMessage("Format d'email invalide.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Le mot de passe est requis.");
        }
    }

    // ── Handler ────────────────────────────────────────────────────────────────
    public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResult>
    {
        private readonly IUserRepository _userRepo;
        private readonly IRefreshTokenRepository _refreshTokenRepo;
        private readonly IUnitOfWork _uow;
        private readonly ITokenService _tokenService;

        public LoginCommandHandler(
            IUserRepository userRepo,
            IRefreshTokenRepository refreshTokenRepo,
            IUnitOfWork uow,
            ITokenService tokenService)
        {
            _userRepo = userRepo;
            _refreshTokenRepo = refreshTokenRepo;
            _uow = uow;
            _tokenService = tokenService;
        }

        public async Task<AuthResult> Handle(LoginCommand request, CancellationToken ct)
        {
            // 1. Retrouver l'utilisateur (message générique pour éviter l'énumération)
            var user = await _userRepo.GetByEmailAsync(request.Email, ct)
                ?? throw new UnauthorizedException("Email ou mot de passe incorrect.");

            // 2. Vérifier que le compte est actif
            if (!user.IsActive)
                throw new UnauthorizedException("Ce compte a été désactivé.");

            // 3. Vérifier le mot de passe
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedException("Email ou mot de passe incorrect.");

            // 4. Générer les tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshTokenValue = _tokenService.GenerateRefreshToken();
            var refreshToken = RefreshToken.Create(user.Id, refreshTokenValue);
            await _refreshTokenRepo.CreateAsync(refreshToken, ct);
            await _uow.SaveChangesAsync(ct);

            return new AuthResult(accessToken, refreshTokenValue, DateTime.UtcNow.AddMinutes(15), user.Role.ToString(), user.Id);
        }
    }
}