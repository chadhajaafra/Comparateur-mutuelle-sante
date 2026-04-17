using Application.Common;
using Domain.Interfaces;
using FluentValidation;
using MediatR;

namespace Comparateur.Application.Features.Auth.Commands
{
    public record ForgotPasswordCommand(string Email) : IRequest;

    public class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
    {
        public ForgotPasswordCommandValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
        }
    }

    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand>
    {
        private readonly IUserRepository _userRepo;
        private readonly IUnitOfWork _uow;
        private readonly IEmailService _emailService;

        public ForgotPasswordCommandHandler(IUserRepository userRepo, IUnitOfWork uow, IEmailService emailService)
        { _userRepo = userRepo; _uow = uow; _emailService = emailService; }

        public async Task Handle(ForgotPasswordCommand request, CancellationToken ct)
        {
            // Ne pas révéler si l'email existe ou non
            var user = await _userRepo.GetByEmailAsync(request.Email, ct);
            if (user is null) return;

            var token = Guid.NewGuid().ToString("N");
            user.SetPasswordResetToken(token, DateTime.UtcNow.AddHours(1));
            await _userRepo.UpdateAsync(user, ct);
            await _uow.SaveChangesAsync(ct);
            _ = _emailService.SendPasswordResetAsync(user.Email, token, ct);
        }
    }

}
