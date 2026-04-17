using Domain.Interfaces;
using MediatR;
namespace Comparateur.Application.Features.Auth.Commands
{
    public record LogoutCommand(Guid UserId, string RefreshToken) : IRequest;

    public class LogoutCommandHandler : IRequestHandler<LogoutCommand>
    {
        private readonly IRefreshTokenRepository _refreshTokenRepo;
        private readonly IUnitOfWork _uow;

        public LogoutCommandHandler(IRefreshTokenRepository refreshTokenRepo, IUnitOfWork uow)
        { _refreshTokenRepo = refreshTokenRepo; _uow = uow; }

        public async Task Handle(LogoutCommand request, CancellationToken ct)
        {
            var token = await _refreshTokenRepo.GetByTokenAsync(request.RefreshToken, ct);
            if (token is not null && token.UserId == request.UserId)
            {
                token.Revoke();
                await _refreshTokenRepo.UpdateAsync(token, ct);
                await _uow.SaveChangesAsync(ct);
            }
        }
    }
}
