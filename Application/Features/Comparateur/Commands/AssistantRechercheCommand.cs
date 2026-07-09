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
    public record AssistantRechercheCommand(string Message, List<ChatMessageDto> Historique) : IRequest<ChatRechercheResultDto>;

    public class AssistantRechercheCommandHandler : IRequestHandler<AssistantRechercheCommand, ChatRechercheResultDto>
    {
        private readonly IAssistantRechercheService _assistantService;
        private readonly IOffreRepository _offreRepository;

        private const int NIVEAU_MIN = 1;
        private const int NIVEAU_MAX = 3;
        private const int TYPE_GARANTIE_MIN = 1;
        private const int TYPE_GARANTIE_MAX = 6;
        private const decimal BUDGET_MIN = 0;
        private const decimal BUDGET_MAX_RAISONNABLE = 1000;

        public AssistantRechercheCommandHandler(
            IAssistantRechercheService assistantService,
            IOffreRepository offreRepository)
        {
            _assistantService = assistantService;
            _offreRepository = offreRepository;
        }

        public async Task<ChatRechercheResultDto> Handle(AssistantRechercheCommand request, CancellationToken ct)
        {
            var historiqueTuples = request.Historique.Select(h => (h.Role, h.Contenu)).ToList();
            var extrait = await _assistantService.AnalyserMessageAsync(request.Message, historiqueTuples, ct);

            // Validation — filtre les hallucinations du LLM
            int? niveauValide = extrait.NiveauSouhaite is >= NIVEAU_MIN and <= NIVEAU_MAX
                ? extrait.NiveauSouhaite : null;

            var typesGarantieValides = (extrait.TypesGarantie ?? new List<int>())
                .Where(t => t is >= TYPE_GARANTIE_MIN and <= TYPE_GARANTIE_MAX)
                .Distinct()
                .ToList();

            decimal? budgetValide = extrait.BudgetMax is >= BUDGET_MIN and <= BUDGET_MAX_RAISONNABLE
                ? extrait.BudgetMax : null;

            var criteres = new CritereRechercheDto((int?)budgetValide, niveauValide, typesGarantieValides);

            List<OffreScoreeDto> offresScored = new();
            bool assezDeCriteres = extrait.CriteresComplets
                || (criteres.BudgetMax is not null && criteres.NiveauSouhaite is not null);

            if (assezDeCriteres)
            {
                var offres = await _offreRepository.GetActiveOffresAsync(ct);
                offresScored = offres
                    .Select(o => ScoringService.MapToScored(o, criteres))
                    .OrderByDescending(o => o.ScoreTotal)
                    .Take(5)
                    .ToList();
            }

            return new ChatRechercheResultDto(
                extrait.ReponseAssistant, extrait.CriteresComplets, criteres, offresScored);
        }
    }
}