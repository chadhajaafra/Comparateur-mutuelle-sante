using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Comparateur.Application.Features.Comparateur.Dtos;
using Comparateur.Application.Features.Comparateur.Services;
using Comparateur.Domain.Entities;
using Comparateur.Domain.Interfaces;
using MediatR;

namespace Comparateur.Application.Features.Comparateur.Commands
{
    public record AnalyserContratCommand(string TexteExtrait) : IRequest<AnalyseContratResultDto>;

    public class AnalyserContratCommandHandler : IRequestHandler<AnalyserContratCommand, AnalyseContratResultDto>
    {
        private readonly IClaudeService _claudeService;
        private readonly IOffreRepository _offreRepository;

        public AnalyserContratCommandHandler(IClaudeService claudeService, IOffreRepository offreRepository)
        {
            _claudeService = claudeService;
            _offreRepository = offreRepository;
        }

        public async Task<AnalyseContratResultDto> Handle(AnalyserContratCommand request, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.TexteExtrait))
                throw new ArgumentException("Le texte extrait du PDF est vide.");

            // 1. Appel IA → modèle Domain
            ContratAnalyseResult resultatDomain = await _claudeService.AnalyserContratAsync(request.TexteExtrait, ct);

            // 2. Mapping Domain → Application DTO
            var contratExtrait = new ContratExtraitDto(
                resultatDomain.AssureurNom,
                resultatDomain.PrixMensuel,
                resultatDomain.NiveauEstime,
                resultatDomain.Garanties
                    .Select(g => new GarantieExtraiteDto(g.Nom, g.TypeGarantieEstime, g.TauxRemboursement, g.Plafond))
                    .ToList()
            );

            // 3. Réutilise ScoringService existant
            var criteres = new CritereRechercheDto(
                BudgetMax: (int?)contratExtrait.PrixMensuel,
                NiveauSouhaite: null,
                TypesGarantie: contratExtrait.Garanties.Select(g => g.TypeGarantieEstime).ToList()
            );

            var offres = await _offreRepository.GetActiveOffresAsync(ct);
            var offresScored = offres
                .Select(o => ScoringService.MapToScored(o, criteres))
                .OrderByDescending(o => o.ScoreTotal)
                .Take(5)
                .ToList();

            return new AnalyseContratResultDto(contratExtrait, offresScored);
        }
    }
}
