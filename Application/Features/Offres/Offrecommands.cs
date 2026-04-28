using Comparateur.Application.Features.Mutuelles;
using Comparateur.Domain.Entities;
using Comparateur.Domain.Enums;
using Comparateur.Domain.Interfaces;
using Domain.Exceptions;
using Domain.Interfaces;
using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Offres
{
    public record CreateOffreCommand(
     Guid MutuelleId,
     string Nom,
     NiveauCouverture Niveau,
     decimal PrixMensuel,
     string? Description,
     Guid RequestingUserId,
     string RequestingUserRole
 ) : IRequest<OffreDto>;

    public class CreateOffreValidator : AbstractValidator<CreateOffreCommand>
    {
        public CreateOffreValidator()
        {
            RuleFor(x => x.Nom).NotEmpty().MaximumLength(200);
            RuleFor(x => x.PrixMensuel).GreaterThan(0).LessThan(10000);
            RuleFor(x => x.Niveau).IsInEnum();
        }
    }

    public class CreateOffreHandler : IRequestHandler<CreateOffreCommand, OffreDto>
    {
        private readonly IMutuelleRepository _mutuelleRepo;
        private readonly IOffreRepository _offreRepo;
        private readonly IUnitOfWork _uow;

        public CreateOffreHandler(IMutuelleRepository mutuelleRepo, IOffreRepository offreRepo, IUnitOfWork uow)
        { _mutuelleRepo = mutuelleRepo; _offreRepo = offreRepo; _uow = uow; }

        public async Task<OffreDto> Handle(CreateOffreCommand cmd, CancellationToken ct)
        {
            var mutuelle = await _mutuelleRepo.GetByIdAsync(cmd.MutuelleId, ct)
                ?? throw new NotFoundException(nameof(Domain.Entities.Mutuelle), cmd.MutuelleId);

            if (cmd.RequestingUserRole == "Assureur" && mutuelle.AssureurId != cmd.RequestingUserId)
                throw new UnauthorizedException("Accès non autorisé.");

            var offre = Offre.Create(cmd.MutuelleId, cmd.Nom, cmd.Niveau, cmd.PrixMensuel, cmd.Description);
            await _offreRepo.CreateAsync(offre, ct);
            await _uow.SaveChangesAsync(ct);

            return new OffreDto(offre.Id, offre.Nom, offre.Niveau, offre.PrixMensuel, offre.Description, offre.IsActive, new());
        }
    }

    // ── Ajouter une Garantie à une Offre ──────────────────────────────────────
    public record AddGarantieToOffreCommand(
        Guid OffreId,
        Guid GarantieId,
        int TauxRemboursement,
        int? Plafond,
        string? Details,
        Guid RequestingUserId,
        string RequestingUserRole
    ) : IRequest<OffreGarantieDto>;

    public class AddGarantieValidator : AbstractValidator<AddGarantieToOffreCommand>
    {
        public AddGarantieValidator()
        {
            RuleFor(x => x.TauxRemboursement).InclusiveBetween(0, 100)
                .WithMessage("Le taux doit être entre 0 et 100%.");
            RuleFor(x => x.Plafond).GreaterThan(0).When(x => x.Plafond.HasValue);
        }
    }

    public class AddGarantieToOffreHandler : IRequestHandler<AddGarantieToOffreCommand, OffreGarantieDto>
    {
        private readonly IOffreRepository _offreRepo;
        private readonly IGarantieRepository _garantieRepo;
        private readonly IUnitOfWork _uow;

        public AddGarantieToOffreHandler(IOffreRepository offreRepo, IGarantieRepository garantieRepo, IUnitOfWork uow)
        { _offreRepo = offreRepo; _garantieRepo = garantieRepo; _uow = uow; }

        public async Task<OffreGarantieDto> Handle(AddGarantieToOffreCommand cmd, CancellationToken ct)
        {
            var offre = await _offreRepo.GetByIdWithGarantiesAsync(cmd.OffreId, ct)
                ?? throw new NotFoundException(nameof(Offre), cmd.OffreId);

            var garantie = await _garantieRepo.GetByIdAsync(cmd.GarantieId, ct)
                ?? throw new NotFoundException(nameof(Garantie), cmd.GarantieId);

            var og = OffreGarantie.Create(cmd.OffreId, cmd.GarantieId, cmd.TauxRemboursement, cmd.Plafond, cmd.Details);
            await _uow.SaveChangesAsync(ct);

            return new OffreGarantieDto(garantie.Id, garantie.Nom, garantie.Type.ToString(),
                og.TauxRemboursement, og.Plafond, og.Details);
        }
    }
}
