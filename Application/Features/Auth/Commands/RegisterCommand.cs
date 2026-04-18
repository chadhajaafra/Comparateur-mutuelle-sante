using Application.Common;
using Comparateur.Application.Common;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using FluentValidation;
using MediatR;

namespace Comparateur.Application.Features.Auth.Commands
{
    // ── Command ────────────────────────────────────────────────────────────────
    public record RegisterCommand(
        string Email,
        string Password,
        string FirstName,
        string LastName,
        UserRole Role = UserRole.Utilisateur
    ) : IRequest<AuthResult>;

    // ── Validator ──────────────────────────────────────────────────────────────
    public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
    {
        public RegisterCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("L'email est requis.")
                .EmailAddress().WithMessage("Format d'email invalide.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Le mot de passe est requis.")
                .MinimumLength(8).WithMessage("Le mot de passe doit contenir au moins 8 caractères.")
                .Matches("[A-Z]").WithMessage("Le mot de passe doit contenir au moins une majuscule.")
                .Matches("[0-9]").WithMessage("Le mot de passe doit contenir au moins un chiffre.");

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("Le prénom est requis.")
                .MaximumLength(100);

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Le nom est requis.")
                .MaximumLength(100);
        }
    }

    // ── Handler ────────────────────────────────────────────────────────────────
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResult>
    {
        private readonly IUserRepository _userRepo;
        private readonly IRefreshTokenRepository _refreshTokenRepo;
        private readonly IUnitOfWork _uow;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;

        public RegisterCommandHandler(
            IUserRepository userRepo,
            IRefreshTokenRepository refreshTokenRepo,
            IUnitOfWork uow,
            ITokenService tokenService,
            IEmailService emailService)
        {
            _userRepo = userRepo;
            _refreshTokenRepo = refreshTokenRepo;
            _uow = uow;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        public async Task<AuthResult> Handle(RegisterCommand request, CancellationToken ct)
        {
            // 1. Vérifier que l'email n'existe pas déjà
            if (await _userRepo.ExistsAsync(request.Email, ct))
                throw new ConflictException("Un compte avec cet email existe déjà.");

            // 2. Hasher le mot de passe
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);

            // 3. Créer l'utilisateur
            var user = User.Create(request.Email, passwordHash, request.FirstName, request.LastName, request.Role);
            await _userRepo.CreateAsync(user, ct);

            // 4. Générer les tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshTokenValue = _tokenService.GenerateRefreshToken();
            var refreshToken = RefreshToken.Create(user.Id, refreshTokenValue);
            await _refreshTokenRepo.CreateAsync(refreshToken, ct);

            // 5. Sauvegarder
            await _uow.SaveChangesAsync(ct);

            // 6. Envoyer l'email de vérification (non bloquant)
            if (user.EmailVerificationToken is not null)
                _ = _emailService.SendEmailVerificationAsync(user.Email, user.EmailVerificationToken, ct);

            return new AuthResult(accessToken, refreshTokenValue, DateTime.UtcNow.AddMinutes(15), user.Role.ToString(), user.Id);
        }
    }
}
