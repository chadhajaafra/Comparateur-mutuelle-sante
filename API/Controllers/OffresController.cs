using Comparateur.Application.Features.Offres;
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
    public class OffresController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IOffreRepository _repo;

        public OffresController(ISender sender, IOffreRepository repo)
        {
            _sender = sender;
            _repo = repo;
        }

        private Guid UserId => Guid.Parse(User.FindFirstValue("sub")!);
        private string UserRole => User.FindFirstValue(ClaimTypes.Role)!;

        // GET api/offres/{id}
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var offre = await _repo.GetByIdWithGarantiesAsync(id, ct);
            if (offre is null) return NotFound();
            return Ok(offre);
        }

        // GET api/offres/mutuelle/{mutuelleId}
        [HttpGet("mutuelle/{mutuelleId:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByMutuelle(Guid mutuelleId, CancellationToken ct)
            => Ok(await _repo.GetByMutuelleAsync(mutuelleId, ct));

        // POST api/offres  (alternatif à api/mutuelles/{id}/offres)
        [HttpPost]
        [Authorize(Roles = "Assureur,Administrateur")]
        public async Task<IActionResult> Create(CreateOffreCommand command, CancellationToken ct)
        {
            var result = await _sender.Send(
                command with { RequestingUserId = UserId, RequestingUserRole = UserRole }, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/offres/{offreId}/garanties
        [HttpPost("{offreId:guid}/garanties")]
        [Authorize(Roles = "Assureur,Administrateur")]
        public async Task<IActionResult> AddGarantie(Guid offreId, AddGarantieToOffreCommand command, CancellationToken ct)
            => Ok(await _sender.Send(
                command with { OffreId = offreId, RequestingUserId = UserId, RequestingUserRole = UserRole }, ct));
    }
}
