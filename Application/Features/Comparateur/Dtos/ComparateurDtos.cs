using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Comparateur.Dtos
{
        public record CritereRechercheDto(
            int? BudgetMax,
            int? NiveauSouhaite,
            List<int>? TypesGarantie
        );

        public record OffreScoreeDto(
            Guid Id,
            string Nom,
            int Niveau,
            string NiveauLabel,
            decimal PrixMensuel,
            Guid MutuelleId,
            string MutuelleNom,
            string? MutuelleLogo,
            int ScoreTotal,
            int ScorePrix,
            int ScoreNiveau,
            int ScoreGaranties,
            List<GarantieScoreDto> Garanties
        );

        public record GarantieScoreDto(
            Guid GarantieId,
            string Nom,
            string Type,
            int TauxRemboursement,
            decimal? Plafond,
            bool MatchCritere
        );

        public record ComparaisonDetailDto(
            Guid SessionId,
            CritereRechercheDto Criteres,
            List<OffreScoreeDto> Offres
        );

        // ← SessionToken ajouté
        public record SessionDto(
            Guid Id,
            string? SessionToken,
            DateTime CreatedAt,
            int NbOffres
        );

        public record PersonneSuppDto(string DateNaissance);
    }