using Comparateur.Application.Features.Mutuelles;
using Comparateur.Application.Features.Offres;
using Comparateur.Domain.Enums;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
namespace Comparateur.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MutuellesController : ControllerBase
    {
        private readonly ISender _sender;
        public MutuellesController(ISender sender) => _sender = sender;

        private Guid UserId
        {
            get
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (!Guid.TryParse(userId, out var id))
                    throw new UnauthorizedAccessException("UserId invalide ou absent");

                return id;
            }
        }
        private string UserRole
        {
            get
            {
                var role = User.FindFirstValue(ClaimTypes.Role);

                if (string.IsNullOrWhiteSpace(role))
                    throw new UnauthorizedAccessException("Rôle utilisateur absent");

                return role;
            }
        }
        // ── GET api/mutuelles ──────────────────────────────────────────────────
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] TypeGarantie? type = null,
            [FromQuery] NiveauCouverture? niveau = null,
            [FromQuery] decimal? prixMin = null,
            [FromQuery] decimal? prixMax = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken ct = default)
        {
            var result = await _sender.Send(
                new GetAllMutuellesQuery(search, type, niveau, prixMin, prixMax, null, page, pageSize), ct);
            return Ok(result);
        }

        // ── GET api/mutuelles/{id} ─────────────────────────────────────────────
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
            => Ok(await _sender.Send(new GetMutuelleByIdQuery(id), ct));

        // ── POST api/mutuelles ─────────────────────────────────────────────────
        [HttpPost]
        [Authorize(Roles = "Assureur,Administrateur")]
        public async Task<IActionResult> Create(CreateMutuelleCommand command, CancellationToken ct)
        {
            var result = await _sender.Send(command with { AssureurId = UserId }, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // ── PUT api/mutuelles/{id} ─────────────────────────────────────────────
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Assureur,Administrateur")]
        public async Task<IActionResult> Update(Guid id, UpdateMutuelleCommand command, CancellationToken ct)
            => Ok(await _sender.Send(
                command with { Id = id, RequestingUserId = UserId, RequestingUserRole = UserRole }, ct));

        // ── DELETE api/mutuelles/{id} ──────────────────────────────────────────
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Assureur,Administrateur")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await _sender.Send(new DeleteMutuelleCommand(id, UserId, UserRole), ct);
            return NoContent();
        }

        // ── POST api/mutuelles/{id}/offres ─────────────────────────────────────
        [HttpPost("{id:guid}/offres")]
        [Authorize(Roles = "Assureur,Administrateur")]
        public async Task<IActionResult> AddOffre(Guid id, CreateOffreCommand command, CancellationToken ct)
            => Ok(await _sender.Send(
                command with { MutuelleId = id, RequestingUserId = UserId, RequestingUserRole = UserRole }, ct));

        // ── POST api/mutuelles/offres/{offreId}/garanties ──────────────────────
        [HttpPost("offres/{offreId:guid}/garanties")]
        [Authorize(Roles = "Assureur,Administrateur")]
        public async Task<IActionResult> AddGarantie(Guid offreId, AddGarantieToOffreCommand command, CancellationToken ct)
            => Ok(await _sender.Send(
                command with { OffreId = offreId, RequestingUserId = UserId, RequestingUserRole = UserRole }, ct));
    }
}
