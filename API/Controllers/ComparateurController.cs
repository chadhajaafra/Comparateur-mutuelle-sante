using Comparateur.Application.Features.Comparateur.Commands;
using Comparateur.Application.Features.Comparateur.Queries;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Security.Claims;

namespace Comparateur.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComparateurController : ControllerBase
    {
        private readonly ISender _sender;
        private const string SESSION_COOKIE = "comp_session";

        public ComparateurController(ISender sender) => _sender = sender;

        private Guid? UserId =>
            User.Identity?.IsAuthenticated == true
                ? Guid.Parse(User.FindFirstValue("sub")!)
                : null;

        private string? SessionToken =>
            Request.Cookies.TryGetValue(SESSION_COOKIE, out var t) ? t : null;

        private void SetSessionCookie(string token) =>
            Response.Cookies.Append(SESSION_COOKIE, token, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(30)
            });

        // GET api/comparateur/recherche?budgetMax=50&niveau=2&typesGarantie=1,3&page=1
        [HttpGet("recherche")]
        [AllowAnonymous]
        public async Task<IActionResult> Recherche(
            [FromQuery] int? budgetMax,
            [FromQuery] int? niveau,
            [FromQuery] string? typesGarantie,
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken ct = default)
        {
            var types = typesGarantie?
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse).ToList();

            var result = await _sender.Send(
                new RechercherOffresQuery(budgetMax, niveau, types, search, page, pageSize), ct);

            return Ok(result);
        }

        // POST api/comparateur/session
        [HttpPost("session")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenirSession(CancellationToken ct)
        {
            var session = await _sender.Send(
                new ObtenirOuCreerSessionCommand(UserId, SessionToken), ct);

            // Persist cookie pour visiteurs
            if (UserId is null)
                SetSessionCookie(session.Id.ToString());

            return Ok(session);
        }

        // GET api/comparateur/session/{sessionId}
        [HttpGet("session/{sessionId:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSession(Guid sessionId, CancellationToken ct)
        {
            var result = await _sender.Send(
                new GetSessionDetailQuery(sessionId), ct);
            return Ok(result);
        }

        // POST api/comparateur/session/{sessionId}/offres
        [HttpPost("session/{sessionId:guid}/offres")]
        [AllowAnonymous]
        public async Task<IActionResult> AjouterOffre(
            Guid sessionId,
            [FromBody] AjouterOffreRequest request,
            CancellationToken ct)
        {
            var result = await _sender.Send(new AjouterOffreSessionCommand(
                sessionId, request.OffreId, UserId, SessionToken), ct);
            return Ok(result);
        }

        // DELETE api/comparateur/session/{sessionId}/offres/{offreId}
        [HttpDelete("session/{sessionId:guid}/offres/{offreId:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> RetirerOffre(
            Guid sessionId, Guid offreId, CancellationToken ct)
        {
            await _sender.Send(new RetirerOffreSessionCommand(
                sessionId, offreId, UserId, SessionToken), ct);
            return NoContent();
        }

        // DELETE api/comparateur/session/{sessionId}
        [HttpDelete("session/{sessionId:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> ViderSession(Guid sessionId, CancellationToken ct)
        {
            await _sender.Send(new ViderSessionCommand(sessionId), ct);
            return NoContent();
        }
    }

    public record AjouterOffreRequest(Guid OffreId);
}
