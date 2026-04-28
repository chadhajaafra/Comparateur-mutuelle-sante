using Comparateur.Application.Features.Offres;
using Comparateur.Domain.Entities;
using Comparateur.Domain.Enums;
using Comparateur.Domain.Interfaces;
using Domain.Exceptions;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Mutuelles
{
    // ── Query ──────────────────────────────────────────────────────────────────
    public record GetAllMutuellesQuery(
        string? Search = null,
        TypeGarantie? TypeGarantie = null,
        NiveauCouverture? Niveau = null,
        decimal? PrixMin = null,
        decimal? PrixMax = null,
        Guid? AssureurId = null,
        int Page = 1,
        int PageSize = 10
    ) : IRequest<PagedResult<MutuelleListItemDto>>;

    // ── Handler ────────────────────────────────────────────────────────────────
    public class GetAllMutuellesHandler : IRequestHandler<GetAllMutuellesQuery, PagedResult<MutuelleListItemDto>>
    {
        private readonly IMutuelleRepository _repo;

        public GetAllMutuellesHandler(IMutuelleRepository repo) => _repo = repo;

        public async Task<PagedResult<MutuelleListItemDto>> Handle(GetAllMutuellesQuery request, CancellationToken ct)
        {
            var filter = new MutuelleFilter(
                request.Search, request.TypeGarantie, request.Niveau,
                request.PrixMin, request.PrixMax, true, request.AssureurId,
                request.Page, request.PageSize
            );

            var (items, total) = await _repo.GetAllAsync(filter, ct);

            var dtos = items.Select(m => new MutuelleListItemDto(
                m.Id,
                m.Nom,
                m.Logo,
                m.IsActive,
                m.Offres.Any() ? m.Offres.Min(o => o.PrixMensuel) : 0,
                m.Offres.Any() ? m.Offres.Max(o => o.PrixMensuel) : 0,
                m.Offres.Count,
                m.Offres
                    .SelectMany(o => o.OffreGaranties)
                    .Select(og => og.Garantie.Type.ToString())
                    .Distinct()
                    .ToList()
            )).ToList();

            return new PagedResult<MutuelleListItemDto>(
                dtos, total, request.Page, request.PageSize,
                (int)Math.Ceiling((double)total / request.PageSize)
            );
        }
    }

    // ── GetById ────────────────────────────────────────────────────────────────
    public record GetMutuelleByIdQuery(Guid Id) : IRequest<MutuelleDto>;

    public class GetMutuelleByIdHandler : IRequestHandler<GetMutuelleByIdQuery, MutuelleDto>
    {
        private readonly IMutuelleRepository _repo;
        public GetMutuelleByIdHandler(IMutuelleRepository repo) => _repo = repo;

        public async Task<MutuelleDto> Handle(GetMutuelleByIdQuery request, CancellationToken ct)
        {
            var m = await _repo.GetByIdWithOffresAsync(request.Id, ct)
                ?? throw new NotFoundException(nameof(Domain.Entities.Mutuelle), request.Id);

            return ToDto(m);
        }

        public static MutuelleDto ToDto(Domain.Entities.Mutuelle m) => new(
            m.Id, m.Nom, m.Description, m.Logo, m.SiteWeb, m.IsActive, m.AssureurId,
            m.Offres.Select(o => new OffreDto(
                o.Id, o.Nom, o.Niveau, o.PrixMensuel, o.Description, o.IsActive,
                o.OffreGaranties.Select(og => new OffreGarantieDto(
                    og.GarantieId, og.Garantie.Nom, og.Garantie.Type.ToString(),
                    og.TauxRemboursement, og.Plafond, og.Details
                )).ToList()
            )).ToList()
        );
    }

}
