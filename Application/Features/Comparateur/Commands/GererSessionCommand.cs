using Comparateur.Application.Features.Comparateur.Dtos;
using Comparateur.Application.Features.Comparateur.Queries;
using Comparateur.Domain.Entities;
using Comparateur.Domain.Interfaces;
using Domain.Exceptions;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;

namespace Comparateur.Application.Features.Comparateur.Commands
{

    // ── Créer ou récupérer session ────────────────────────────────────────────────
    public record ObtenirOuCreerSessionCommand(
        Guid? UserId,
        string? SessionToken
    ) : IRequest<SessionDto>;

    public class ObtenirOuCreerSessionHandler
        : IRequestHandler<ObtenirOuCreerSessionCommand, SessionDto>
    {
        private readonly IComparaisonRepository _repo;
        public ObtenirOuCreerSessionHandler(IComparaisonRepository repo) => _repo = repo;

        public async Task<SessionDto> Handle(ObtenirOuCreerSessionCommand cmd, CancellationToken ct)
        {
            ComparaisonSession? session = null;

            if (cmd.UserId.HasValue)
                session = await _repo.GetByUserIdAsync(cmd.UserId.Value, ct);
            else if (!string.IsNullOrEmpty(cmd.SessionToken))
                session = await _repo.GetByTokenAsync(cmd.SessionToken, ct);

            if (session is null)
            {
                session = cmd.UserId.HasValue
                    ? ComparaisonSession.CreateForUser(cmd.UserId.Value)
                    : ComparaisonSession.CreateForVisitor(cmd.SessionToken ?? Guid.NewGuid().ToString());

                session = await _repo.CreateAsync(session, ct);
            }

            return new SessionDto(session.Id, session.CreatedAt, session.Items.Count);
        }
    }

    // ── Ajouter offre à la session ────────────────────────────────────────────────
    public record AjouterOffreSessionCommand(
        Guid SessionId,
        Guid OffreId,
        Guid? RequestingUserId,
        string? SessionToken
    ) : IRequest<ComparaisonDetailDto>;

    public class AjouterOffreSessionHandler
        : IRequestHandler<AjouterOffreSessionCommand, ComparaisonDetailDto>
    {
        private readonly IComparaisonRepository _repo;
        private readonly IOffreRepository _offreRepo;
        public AjouterOffreSessionHandler(IComparaisonRepository repo, IOffreRepository offreRepo)
        { _repo = repo; _offreRepo = offreRepo; }

        public async Task<ComparaisonDetailDto> Handle(
            AjouterOffreSessionCommand cmd, CancellationToken ct)
        {
            // Fix for the NotFoundException instantiation to include the required 'key' parameter.
            var session = await _repo.GetByIdAsync(cmd.SessionId, ct)
                ?? throw new NotFoundException("Session introuvable", cmd.SessionId);

            // Vérif ownership
            if (session.UserId.HasValue && session.UserId != cmd.RequestingUserId)
                throw new UnauthorizedException("Session appartient à un autre utilisateur");

            if (session.Items.Count >= 3)
                throw new BusinessException("Maximum 3 offres par comparaison");

            if (session.Items.Any(i => i.OffreId == cmd.OffreId))
                throw new BusinessException("Cette offre est déjà dans la comparaison");

            var offre = await _offreRepo.GetByIdAsync(cmd.OffreId, ct)
                ?? throw new NotFoundException("Offre introuvable", cmd.OffreId);

            if (!offre.IsActive)
                throw new BusinessException("Cette offre n'est plus disponible");

            int position = session.Items.Count + 1;
            session.Items.Add(ComparaisonItem.Create(session.Id, cmd.OffreId, position));
            session.Touch();
            await _repo.UpdateAsync(session, ct);

            return await BuildDetailDto(session, ct);
        }

        private async Task<ComparaisonDetailDto> BuildDetailDto(
            ComparaisonSession session, CancellationToken ct)
        {
            var criteres = new CritereRechercheDto(
                session.BudgetMax, session.NiveauSouhaite,
                session.TypesGarantieSouhaites is null ? null
                    : System.Text.Json.JsonSerializer.Deserialize<List<int>>(session.TypesGarantieSouhaites));

            var offresScored = new List<OffreScoreeDto>();
            foreach (var item in session.Items.OrderBy(i => i.Position))
            {
                var offre = await _offreRepo.GetByIdWithGarantiesAsync(item.OffreId, ct);
                if (offre is not null)
                    offresScored.Add(RechercherOffresHandler.MapToScoredStatic(offre, criteres));
            }

            return new ComparaisonDetailDto(session.Id, criteres, offresScored);
        }
    }

    // ── Retirer offre ─────────────────────────────────────────────────────────────
    public record RetirerOffreSessionCommand(
        Guid SessionId,
        Guid OffreId,
        Guid? RequestingUserId,
        string? SessionToken
    ) : IRequest<Unit>;

    public class RetirerOffreSessionHandler
        : IRequestHandler<RetirerOffreSessionCommand, Unit>
    {
        private readonly IComparaisonRepository _repo;
        public RetirerOffreSessionHandler(IComparaisonRepository repo) => _repo = repo;

        public async Task<Unit> Handle(RetirerOffreSessionCommand cmd, CancellationToken ct)
        {
            // Fix for the NotFoundException instantiation to include the required 'key' parameter.
            var session = await _repo.GetByIdAsync(cmd.SessionId, ct)
                ?? throw new NotFoundException("Session introuvable", cmd.SessionId);

            var item = session.Items.FirstOrDefault(i => i.OffreId == cmd.OffreId)
                ?? throw new NotFoundException("Offre absente de la session", cmd.OffreId);

            session.Items.Remove(item);
            // Réindexer les positions
            for (int i = 0; i < session.Items.Count; i++)
                session.Items[i] = ComparaisonItem.Create(session.Id, session.Items[i].OffreId, i + 1);

            session.Touch();
            await _repo.UpdateAsync(session, ct);
            return Unit.Value;
        }
    }

    // ── Vider la session ──────────────────────────────────────────────────────────
    public record ViderSessionCommand(Guid SessionId) : IRequest<Unit>;

    public class ViderSessionHandler : IRequestHandler<ViderSessionCommand, Unit>
    {
        private readonly IComparaisonRepository _repo;
        public ViderSessionHandler(IComparaisonRepository repo) => _repo = repo;

        public async Task<Unit> Handle(ViderSessionCommand cmd, CancellationToken ct)
        {
            // Fix for the NotFoundException instantiation to include the required 'key' parameter.
            var session = await _repo.GetByIdAsync(cmd.SessionId, ct)
                ?? throw new NotFoundException("Session introuvable", cmd.SessionId);
            session.Items.Clear();
            session.Touch();
            await _repo.UpdateAsync(session, ct);
            return Unit.Value;
        }
    }
}
