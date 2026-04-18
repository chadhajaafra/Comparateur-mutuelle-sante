using Comparateur.Application.Features.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Comparateur.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ISender _sender;
        public AuthController(ISender sender) => _sender = sender;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterCommand command, CancellationToken ct)
            => Ok(await _sender.Send(command, ct));

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginCommand command, CancellationToken ct)
            => Ok(await _sender.Send(command, ct));

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshTokenCommand command, CancellationToken ct)
            => Ok(await _sender.Send(command, ct));

        [HttpPost("logout"), Authorize]
        public async Task<IActionResult> Logout([FromBody] string refreshToken, CancellationToken ct)
        {
            var userId = Guid.Parse(User.FindFirstValue("sub")!);
            await _sender.Send(new LogoutCommand(userId, refreshToken), ct);
            return NoContent();
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordCommand command, CancellationToken ct)
        {
            await _sender.Send(command, ct);
            return Ok(new { message = "Si cet email existe, un lien a été envoyé." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordCommand command, CancellationToken ct)
        {
            await _sender.Send(command, ct);
            return Ok(new { message = "Mot de passe réinitialisé avec succès." });
        }
        }
}