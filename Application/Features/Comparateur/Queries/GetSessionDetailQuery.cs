using Comparateur.Application.Features.Comparateur.Dtos;
using Comparateur.Application.Features.Comparateur.Services;
using Comparateur.Domain.Interfaces;
using Domain.Exceptions;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Comparateur.Queries
{
    public record GetSessionDetailQuery(Guid SessionId) : IRequest<ComparaisonDetailDto>;

    public class GetSessionDetailHandler
            : IRequestHandler<GetSessionDetailQuery, ComparaisonDetailDto>
    {
        private readonly IComparaisonRepository _repo;
        private readonly IOffreRepository _offreRepo;

        public GetSessionDetailHandler(
            IComparaisonRepository repo,
            IOffreRepository offreRepo)
        {
            _repo = repo;
            _offreRepo = offreRepo;
        }

        public async Task<ComparaisonDetailDto> Handle(
            GetSessionDetailQuery query, CancellationToken ct)
        {
            var session = await _repo.GetByIdAsync(query.SessionId, ct)
                ?? throw new NotFoundException("Session introuvable", query.SessionId);

            var criteres = new CritereRechercheDto(
                session.BudgetMax,
                session.NiveauSouhaite,
                session.TypesGarantieSouhaites is null
                    ? null
                    : System.Text.Json.JsonSerializer
                        .Deserialize<List<int>>(session.TypesGarantieSouhaites)
            );

            var offresScored = new List<OffreScoreeDto>();

            foreach (var item in session.Items.OrderBy(i => i.Position))
            {
                var offre = await _offreRepo.GetByIdWithGarantiesAsync(item.OffreId, ct);
                if (offre is not null)
                    offresScored.Add(ScoringService.MapToScored(offre, criteres));
            }

            return new ComparaisonDetailDto(session.Id, criteres, offresScored);
        }
    }
}
