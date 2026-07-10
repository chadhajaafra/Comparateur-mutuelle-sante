using Comparateur.Application.Features.Comparateur.Commands;
using Comparateur.Application.Features.Comparateur.Dtos;
using Comparateur.Application.Features.Comparateur.Queries;
using Comparateur.Domain.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Comparateur.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComparateurController : ControllerBase
    {
        private readonly ISender _sender;
        private const string SESSION_COOKIE = "comp_session";
        private readonly IPdfTextExtractorService _pdfExtractor;


        public ComparateurController(ISender sender, IPdfTextExtractorService pdfExtractor)
        {
            _sender = sender;
            _pdfExtractor = pdfExtractor;
        }
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
            [FromQuery] List<int>? typesGarantie,
            [FromQuery] string? search,
            [FromQuery] string? couverture,
            [FromQuery] bool? assureActuellement,
            [FromQuery] string? codePostal,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken ct = default)
        {
            var result = await _sender.Send(new RechercherOffresQuery(
                budgetMax, niveau, typesGarantie, search,
                couverture, assureActuellement, codePostal,
                page, pageSize), ct);

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

        [HttpPost("analyser-contrat")]
        [AllowAnonymous]
        [RequestSizeLimit(10_000_000)] // 10 MB max
        public async Task<IActionResult> AnalyserContrat(IFormFile fichier, CancellationToken ct)
        {
            if (fichier is null || fichier.Length == 0)
                return BadRequest(new { message = "Aucun fichier reçu." });

            if (fichier.ContentType != "application/pdf")
                return BadRequest(new { message = "Seuls les fichiers PDF sont acceptés." });

            string texte;
            using (var stream = fichier.OpenReadStream())
            {
                texte = _pdfExtractor.ExtraireTexte(stream);
            }

            if (string.IsNullOrWhiteSpace(texte))
                return BadRequest(new { message = "Impossible d'extraire du texte de ce PDF (scanné/image ?)." });

            try
            {
                var result = await _sender.Send(new AnalyserContratCommand(texte), ct);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(502, new { message = "Erreur lors de l'analyse IA.", detail = ex.Message });
            }
        }
        //chabot
        [HttpPost("assistant-chat")]
        [AllowAnonymous]
        public async Task<IActionResult> AssistantChat(
        [FromBody] AssistantChatRequest request, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { message = "Message vide." });

            try
            {
                var result = await _sender.Send(
                    new AssistantRechercheCommand(request.Message, request.Historique ?? new()), ct);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(502, new { message = "Erreur assistant IA.", detail = ex.Message });
            }
        }

        [HttpPost("recherche-partielle")]
        [AllowAnonymous]
        public async Task<IActionResult> RechercherPartielle(
            [FromBody] CritereRechercheDto criteres, CancellationToken ct)
        {
            var offres = await _sender.Send(new RechercherAvecCriteresCommand(criteres), ct);
            return Ok(offres);
        }
    }
    
    public record AjouterOffreRequest(Guid OffreId);
    public record AssistantChatRequest(string Message, List<ChatMessageDto>? Historique);

}
