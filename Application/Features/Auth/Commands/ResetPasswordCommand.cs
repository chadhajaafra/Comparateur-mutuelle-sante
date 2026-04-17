using Domain.Exceptions;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;

namespace Comparateur.Application.Features.Auth.Commands
{
    public record ResetPasswordCommand(string Token, string NewPassword, string ConfirmPassword) : IRequest;

    public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
    {
        public ResetPasswordCommandValidator()
        {
            RuleFor(x => x.NewPassword)
                .MinimumLength(8).WithMessage("Le mot de passe doit contenir au moins 8 caractères.")
                .Matches("[A-Z]").WithMessage("Le mot de passe doit contenir au moins une majuscule.")
                .Matches("[0-9]").WithMessage("Le mot de passe doit contenir au moins un chiffre.");

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.NewPassword).WithMessage("Les mots de passe ne correspondent pas.");
        }
    }

    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand>
    {
        private readonly IUserRepository _userRepo;
        private readonly IUnitOfWork _uow;

        public ResetPasswordCommandHandler(IUserRepository userRepo, IUnitOfWork uow)
        { _userRepo = userRepo; _uow = uow; }

        public async Task Handle(ResetPasswordCommand request, CancellationToken ct)
        {
            var user = await _userRepo.GetByPasswordResetTokenAsync(request.Token, ct)
                ?? throw new UnauthorizedException("Token de réinitialisation invalide ou expiré.");

            if (user.PasswordResetTokenExpiry < DateTime.UtcNow)
                throw new UnauthorizedException("Le lien de réinitialisation a expiré.");

            var hash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, workFactor: 12);
            user.ResetPassword(hash);
            await _userRepo.UpdateAsync(user, ct);
            await _uow.SaveChangesAsync(ct);
        }
    }
}
