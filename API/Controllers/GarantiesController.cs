using Comparateur.Application.Features.Offres;
using Comparateur.Domain.Entities;
using Comparateur.Domain.Enums;
using Comparateur.Domain.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Comparateur.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GarantiesController : ControllerBase
    {
        private readonly IGarantieRepository _repo;
        private readonly IUnitOfWork _uow;

        public GarantiesController(IGarantieRepository repo, IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        // GET api/garanties — liste le catalogue
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await _repo.GetAllAsync(ct));

        // POST api/garanties — Admin crée une entrée catalogue
        [HttpPost]
        [Authorize(Roles = "Administrateur")]
        public async Task<IActionResult> Create([FromBody] CreateGarantieRequest request, CancellationToken ct)
        {
            var garantie = Garantie.Create(request.Nom, request.Type, request.Description, request.Icone);
            await _repo.CreateAsync(garantie, ct);
            await _uow.SaveChangesAsync(ct);
            return CreatedAtAction(nameof(GetAll), new { id = garantie.Id }, garantie);
        }

        // POST api/garanties/seed — initialise le catalogue de base
        [HttpPost("seed")]
        [Authorize(Roles = "Administrateur")]
        public async Task<IActionResult> Seed(CancellationToken ct)
        {
            var existing = await _repo.GetAllAsync(ct);
            if (existing.Any())
                return BadRequest("Le catalogue est déjà initialisé.");

            var catalogue = new List<(string Nom, TypeGarantie Type, string Icone)>
        {
            ("Santé générale",    TypeGarantie.SanteGenerale,   "🏥"),
            ("Dentaire",          TypeGarantie.Dentaire,         "🦷"),
            ("Optique",           TypeGarantie.Optique,          "👓"),
            ("Hospitalisation",   TypeGarantie.Hospitalisation,  "🏨"),
            ("Maternité",         TypeGarantie.Maternite,        "👶"),
            ("Médecines douces",  TypeGarantie.MedecineDouces,   "🌿"),
        };

            foreach (var (nom, type, icone) in catalogue)
            {
                var g = Garantie.Create(nom, type, icone: icone);
                await _repo.CreateAsync(g, ct);
            }

            await _uow.SaveChangesAsync(ct);
            return Ok(new { message = $"{catalogue.Count} garanties créées." });
        }
    }

    public record CreateGarantieRequest(
        string Nom,
        TypeGarantie Type,
        string? Description = null,
        string? Icone = null
    );
}
