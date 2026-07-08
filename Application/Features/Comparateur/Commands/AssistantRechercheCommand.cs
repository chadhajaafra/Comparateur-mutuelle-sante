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

        public AssistantRechercheCommandHandler(
            IAssistantRechercheService assistantService,
            IOffreRepository offreRepository)
        {
            _assistantService = assistantService;
            _offreRepository = offreRepository;
        }

        public async Task<ChatRechercheResultDto> Handle(AssistantRechercheCommand request, CancellationToken ct)
        {
            var historiqueTuples = request.Historique
                .Select(h => (h.Role, h.Contenu))
                .ToList();

            var extrait = await _assistantService.AnalyserMessageAsync(request.Message, historiqueTuples, ct);

            var criteres = new CritereRechercheDto(
                BudgetMax: (int?)extrait.BudgetMax,
                NiveauSouhaite: extrait.NiveauSouhaite,
                TypesGarantie: extrait.TypesGarantie
            );

            // Ne cherche des offres que si on a au moins un critère exploitable
            List<OffreScoreeDto> offresScored = new();
            if (extrait.BudgetMax is not null || extrait.NiveauSouhaite is not null || extrait.TypesGarantie.Count > 0)
            {
                var offres = await _offreRepository.GetActiveOffresAsync(ct);
                offresScored = offres
                    .Select(o => ScoringService.MapToScored(o, criteres))
                    .OrderByDescending(o => o.ScoreTotal)
                    .Take(5)
                    .ToList();
            }

            return new ChatRechercheResultDto(
                extrait.ReponseAssistant,
                extrait.CriteresComplets,
                criteres,
                offresScored
            );
        }
    }
}
