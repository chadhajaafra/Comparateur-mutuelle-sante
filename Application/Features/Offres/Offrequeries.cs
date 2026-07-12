using Comparateur.Application.Features.Mutuelles;
using Comparateur.Domain.Interfaces;
using Domain.Exceptions;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Offres
{
    public record GetOffreeByIdQuery(Guid Id) : IRequest<OffreDto>;

    public class GetOffreByIdHandler : IRequestHandler<GetOffreeByIdQuery, OffreDto>
    {
        private readonly IOffreRepository _repo;
        public GetOffreByIdHandler(IOffreRepository repo) => _repo = repo;

        public async Task<OffreDto> Handle(GetOffreeByIdQuery request, CancellationToken ct)
        {
            var o = await _repo.GetByIdAsync(request.Id, ct)
                ?? throw new NotFoundException(nameof(Domain.Entities.Offre), request.Id);

            return ToDto(o);
        }

        public static OffreDto ToDto(Domain.Entities.Offre o) => new(
            o.Id, o.Nom, o.Niveau, o.PrixMensuel, o.Description, o.IsActive, o.OffreGaranties.Select(og => new OffreGarantieDto(
                    og.GarantieId, og.Garantie.Nom, og.Garantie.Type.ToString(),
                    og.TauxRemboursement, og.Plafond, og.Details
                )).ToList());
    }
}
