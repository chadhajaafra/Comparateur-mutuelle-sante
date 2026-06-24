using Comparateur.Application.Features.Comparateur.Dtos;
using Comparateur.Application.Features.Comparateur.Services;
using Comparateur.Application.Features.Mutuelles;
using Comparateur.Domain.Entities;
using Comparateur.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Comparateur.Queries
{
        public record RechercherOffresQuery(
            int? BudgetMax,
            int? NiveauSouhaite,
            List<int>? TypesGarantie,
            string? Search,
            string? Couverture,           // ← majuscule corrigée
            bool? AssureActuellement,
            string? CodePostal,
            int Page = 1,
            int PageSize = 10
        ) : IRequest<PagedResult<OffreScoreeDto>>;

        public class RechercherOffresHandler
            : IRequestHandler<RechercherOffresQuery, PagedResult<OffreScoreeDto>>
        {
            private readonly IOffreRepository _offreRepo;
            public RechercherOffresHandler(IOffreRepository offreRepo) => _offreRepo = offreRepo;

            public async Task<PagedResult<OffreScoreeDto>> Handle(
                RechercherOffresQuery q, CancellationToken ct)
            {
                var offres = await _offreRepo.GetAllActiveWithGarantiesAsync(
                    q.Search, q.NiveauSouhaite, q.TypesGarantie, ct);

                var criteres = new CritereRechercheDto(q.BudgetMax, q.NiveauSouhaite, q.TypesGarantie);

                var scorees = offres
                    .Select(o => ScoringService.MapToScored(o, criteres))
                    .OrderByDescending(o => o.ScoreTotal)
                    .ThenBy(o => o.PrixMensuel)
                    .ToList();

                int total = scorees.Count;
                var items = scorees
                    .Skip((q.Page - 1) * q.PageSize)
                    .Take(q.PageSize)
                    .ToList();

                return new PagedResult<OffreScoreeDto>(
                    items, total, q.Page, q.PageSize,
                    (int)Math.Ceiling((double)total / q.PageSize));
            }
        }
    }