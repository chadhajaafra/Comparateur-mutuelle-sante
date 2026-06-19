using Comparateur.Application.Features.Comparateur.Dtos;
using Comparateur.Application.Features.Comparateur.Queries;
using Comparateur.Application.Features.Comparateur.Services;
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
        // ── Créer ou récupérer session ────────────────────────────────────────────
        public record ObtenirOuCreerSessionCommand(
            Guid? UserId,
            string? SessionToken,
            int? BudgetMax = null,
            int? NiveauSouhaite = null,
            List<int>? TypesGarantie = null,
            string? Couverture = null,
            bool? AssureActuellement = null,
            string? Civilite = null,
            string? DateNaissance = null,
            string? CodePostal = null,
            string? Profession = null,
            string? RegimeSocial = null,
            string? DateEffet = null,
            List<PersonneSuppDto>? PersonnesSupp = null
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

                bool hasCriteres = cmd.BudgetMax.HasValue
                    || cmd.NiveauSouhaite.HasValue
                    || cmd.TypesGarantie is { Count: > 0 }
                    || cmd.Couverture is not null
                    || cmd.DateNaissance is not null;

                if (hasCriteres)
                {
                    var personnesJson = cmd.PersonnesSupp is { Count: > 0 }
                        ? System.Text.Json.JsonSerializer.Serialize(cmd.PersonnesSupp)
                        : null;

                    session.SetCriteres(
                        budgetMax: cmd.BudgetMax,
                        niveau: cmd.NiveauSouhaite,
                        types: cmd.TypesGarantie,
                        couverture: cmd.Couverture,
                        assureActuellement: cmd.AssureActuellement,
                        civilite: cmd.Civilite,
                        dateNaissance: cmd.DateNaissance,
                        codePostal: cmd.CodePostal,
                        profession: cmd.Profession,
                        regimeSocial: cmd.RegimeSocial,
                        dateEffet: cmd.DateEffet,
                        personnesSuppJson: personnesJson
                    );

                    await _repo.UpdateAsync(session, ct);
                }

                // SessionToken inclus dans le retour
                return new SessionDto(session.Id, session.SessionToken, session.CreatedAt, session.Items.Count);
            }
        }

        // ── Ajouter offre ─────────────────────────────────────────────────────────
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
                var session = await _repo.GetByIdAsync(cmd.SessionId, ct)
                    ?? throw new NotFoundException("Session introuvable", cmd.SessionId);

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
                    session.BudgetMax,
                    session.NiveauSouhaite,
                    session.TypesGarantieSouhaites is null
                        ? null
                        : System.Text.Json.JsonSerializer.Deserialize<List<int>>(session.TypesGarantieSouhaites));

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

        // ── Retirer offre ─────────────────────────────────────────────────────────
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
                var session = await _repo.GetByIdAsync(cmd.SessionId, ct)
                    ?? throw new NotFoundException("Session introuvable", cmd.SessionId);

                var item = session.Items.FirstOrDefault(i => i.OffreId == cmd.OffreId)
                    ?? throw new NotFoundException("Offre absente de la session", cmd.OffreId);

                session.Items.Remove(item);

                // Réindexer sans créer de nouveaux objets
                var ordered = session.Items.OrderBy(i => i.Position).ToList();
                for (int i = 0; i < ordered.Count; i++)
                    ordered[i].UpdatePosition(i + 1);

                session.Touch();
                await _repo.UpdateAsync(session, ct);
                return Unit.Value;
            }
        }

        // ── Vider la session ──────────────────────────────────────────────────────
        public record ViderSessionCommand(Guid SessionId) : IRequest<Unit>;

        public class ViderSessionHandler : IRequestHandler<ViderSessionCommand, Unit>
        {
            private readonly IComparaisonRepository _repo;
            public ViderSessionHandler(IComparaisonRepository repo) => _repo = repo;

            public async Task<Unit> Handle(ViderSessionCommand cmd, CancellationToken ct)
            {
                var session = await _repo.GetByIdAsync(cmd.SessionId, ct)
                    ?? throw new NotFoundException("Session introuvable", cmd.SessionId);

                session.Items.Clear();
                session.Touch();
                await _repo.UpdateAsync(session, ct);
                return Unit.Value;
            }
        }
    }
