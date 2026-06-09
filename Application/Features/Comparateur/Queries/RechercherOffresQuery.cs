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
            // Charge toutes les offres actives avec garanties
            var offres = await _offreRepo.GetAllActiveWithGarantiesAsync(
                q.Search, q.NiveauSouhaite, q.TypesGarantie, ct);

            var criteres = new CritereRechercheDto(q.BudgetMax, q.NiveauSouhaite, q.TypesGarantie);

            // Score + tri
            var scorees = offres
                .Select(o => MapToScored(o, criteres))
                .OrderByDescending(o => o.ScoreTotal)
                .ThenBy(o => o.PrixMensuel)
                .ToList(); 

            int total = scorees.Count;
            var items = scorees.Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToList();

            return new PagedResult<OffreScoreeDto>(items, total, q.Page, q.PageSize);
        }

        private static OffreScoreeDto MapToScored(Offre o, CritereRechercheDto criteres)
        {
            var typesSouhaites = criteres.TypesGarantie ?? new();
            int scoreTotal = ScoringService.CalculerScore(o, criteres);
            int scorePrix = ScoringService.ScorePrixPublic(o.PrixMensuel, criteres.BudgetMax);
            int scoreNiveau = ScoringService.ScoreNiveauPublic((int)o.Niveau, criteres.NiveauSouhaite);
            int scoreGaranties = ScoringService.ScoreGarantiesPublic(o.OffreGaranties, criteres.TypesGarantie);

            return new OffreScoreeDto(
                Id: o.Id,
                Nom: o.Nom,
                Niveau: (int)o.Niveau,
                NiveauLabel: o.Niveau.ToString(),
                PrixMensuel: o.PrixMensuel,
                MutuelleId: o.MutuelleId,
                MutuelleNom: o.Mutuelle.Nom,
                MutuelleLogo: o.Mutuelle.Logo,
                ScoreTotal: scoreTotal,
                ScorePrix: scorePrix,
                ScoreNiveau: scoreNiveau,
                ScoreGaranties: scoreGaranties,
                Garanties: o.OffreGaranties.Select(og => new GarantieScoreDto(
                    GarantieId: og.GarantieId,
                    Nom: og.Garantie.Nom,
                    Type: og.Garantie.Type.ToString(),
                    TauxRemboursement: og.TauxRemboursement,
                    Plafond: og.Plafond,
                    MatchCritere: typesSouhaites.Contains((int)og.Garantie.Type)
                )).ToList()
            );
        }
    }
}
