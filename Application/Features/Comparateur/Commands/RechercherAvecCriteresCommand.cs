using Comparateur.Application.Features.Comparateur.Dtos;
using Comparateur.Application.Features.Comparateur.Services;
using Comparateur.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Comparateur.Commands
{
    public record RechercherAvecCriteresCommand(CritereRechercheDto Criteres) : IRequest<List<OffreScoreeDto>>;

    public class RechercherAvecCriteresCommandHandler : IRequestHandler<RechercherAvecCriteresCommand, List<OffreScoreeDto>>
    {
        private readonly IOffreRepository _offreRepository;

        public RechercherAvecCriteresCommandHandler(IOffreRepository offreRepository)
        {
            _offreRepository = offreRepository;
        }

        public async Task<List<OffreScoreeDto>> Handle(RechercherAvecCriteresCommand request, CancellationToken ct)
        {
            var offres = await _offreRepository.GetActiveOffresAsync(ct);

            var offresFiltrees = offres.Where(o =>
                (request.Criteres.BudgetMax is null || o.PrixMensuel <= request.Criteres.BudgetMax * 1.15m) &&
                (request.Criteres.NiveauSouhaite is null || (int)o.Niveau == request.Criteres.NiveauSouhaite)
            ).ToList();

            if (offresFiltrees.Count == 0)
                offresFiltrees = (List<Domain.Entities.Offre>)offres;

            return offresFiltrees
                .Select(o => ScoringService.MapToScored(o, request.Criteres))
                .OrderByDescending(o => o.ScoreTotal)
                .Take(5)
                .ToList();
        }
    }
}