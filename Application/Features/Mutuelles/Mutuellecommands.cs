using Comparateur.Domain.Entities;
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

namespace Comparateur.Application.Features.Mutuelles
{
 
    public record CreateMutuelleCommand(
        string Nom,
        string Description,
        string Logo,
        string SiteWeb,
        Guid AssureurId
    ) : IRequest<MutuelleDto>;

    public class CreateMutuelleValidator : AbstractValidator<CreateMutuelleCommand>
    {
        public CreateMutuelleValidator()
        {
            RuleFor(x => x.Nom)
                .NotEmpty().WithMessage("Le nom est requis.")
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("La description est requise.")
                .MaximumLength(2000);

            RuleFor(x => x.SiteWeb)
                .NotEmpty().WithMessage("Le site web est requis.")
                .Must(u => Uri.TryCreate(u, UriKind.Absolute, out _))
                .WithMessage("L'URL du site web est invalide.");

            RuleFor(x => x.AssureurId)
                .NotEmpty().WithMessage("L'assureur est requis.");
        }
    }

    public class CreateMutuelleHandler : IRequestHandler<CreateMutuelleCommand, MutuelleDto>
    {
        private readonly IMutuelleRepository _repo;
        private readonly IUnitOfWork _uow;

        public CreateMutuelleHandler(IMutuelleRepository repo, IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        public async Task<MutuelleDto> Handle(CreateMutuelleCommand cmd, CancellationToken ct)
        {
            var mutuelle = Mutuelle.Create(
                cmd.Nom,
                cmd.Description,
                cmd.Logo,
                cmd.SiteWeb,
                cmd.AssureurId
            );

            await _repo.CreateAsync(mutuelle, ct);
            await _uow.SaveChangesAsync(ct);

            var created = await _repo.GetByIdWithOffresAsync(mutuelle.Id, ct);
            return GetMutuelleByIdHandler.ToDto(created!);
        }
    }

    // ── UPDATE ─────────────────────────────────────────────────────────────────

    public record UpdateMutuelleCommand(
        Guid Id,
        string Nom,
        string Description,
        string Logo,
        string SiteWeb,
        Guid RequestingUserId,
        string RequestingUserRole
    ) : IRequest<MutuelleDto>;

    public class UpdateMutuelleValidator : AbstractValidator<UpdateMutuelleCommand>
    {
        public UpdateMutuelleValidator()
        {
            RuleFor(x => x.Nom)
                .NotEmpty().WithMessage("Le nom est requis.")
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("La description est requise.")
                .MaximumLength(2000);

            RuleFor(x => x.SiteWeb)
                .Must(u => string.IsNullOrEmpty(u) || Uri.TryCreate(u, UriKind.Absolute, out _))
                .WithMessage("L'URL du site web est invalide.");
        }
    }

    public class UpdateMutuelleHandler : IRequestHandler<UpdateMutuelleCommand, MutuelleDto>
    {
        private readonly IMutuelleRepository _repo;
        private readonly IUnitOfWork _uow;

        public UpdateMutuelleHandler(IMutuelleRepository repo, IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        public async Task<MutuelleDto> Handle(UpdateMutuelleCommand cmd, CancellationToken ct)
        {
            var mutuelle = await _repo.GetByIdWithOffresAsync(cmd.Id, ct)
                ?? throw new NotFoundException(nameof(Mutuelle), cmd.Id);

            // Un assureur ne peut modifier que ses propres mutuelles
            if (cmd.RequestingUserRole == "Assureur" && mutuelle.AssureurId != cmd.RequestingUserId)
                throw new UnauthorizedException("Vous ne pouvez modifier que vos propres mutuelles.");

            mutuelle.Update(cmd.Nom, cmd.Description, cmd.Logo, cmd.SiteWeb);

            await _repo.UpdateAsync(mutuelle, ct);
            await _uow.SaveChangesAsync(ct);

            return GetMutuelleByIdHandler.ToDto(mutuelle);
        }
    }

    // ── DELETE (soft delete) ───────────────────────────────────────────────────

    public record DeleteMutuelleCommand(
        Guid Id,
        Guid RequestingUserId,
        string RequestingUserRole
    ) : IRequest;

    public class DeleteMutuelleHandler : IRequestHandler<DeleteMutuelleCommand>
    {
        private readonly IMutuelleRepository _repo;
        private readonly IUnitOfWork _uow;

        public DeleteMutuelleHandler(IMutuelleRepository repo, IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        public async Task Handle(DeleteMutuelleCommand cmd, CancellationToken ct)
        {
            var mutuelle = await _repo.GetByIdAsync(cmd.Id, ct)
                ?? throw new NotFoundException(nameof(Mutuelle), cmd.Id);

            // Un assureur ne peut supprimer que ses propres mutuelles
            if (cmd.RequestingUserRole == "Assureur" && mutuelle.AssureurId != cmd.RequestingUserId)
                throw new UnauthorizedException("Vous ne pouvez supprimer que vos propres mutuelles.");

            mutuelle.Deactivate();

            await _repo.UpdateAsync(mutuelle, ct);
            await _uow.SaveChangesAsync(ct);
        }
    }
}
