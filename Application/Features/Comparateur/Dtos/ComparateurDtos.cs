using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Comparateur.Dtos
{
    public record CritereRechercheDto(
    int? BudgetMax,
    int? NiveauSouhaite,      // 1=Eco 2=Standard 3=Premium
    List<int>? TypesGarantie        // ex: [1,3] = SanteGenerale + Optique
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
        int ScoreTotal,         // 0-100
        int ScorePrix,          // 0-100
        int ScoreNiveau,        // 0-100
        int ScoreGaranties,     // 0-100
        List<GarantieScoreDto> Garanties
    );

    public record GarantieScoreDto(
        Guid GarantieId,
        string Nom,
        string Type,
        int TauxRemboursement,
        decimal? Plafond,
        bool MatchCritere        // true si ce type est dans TypesGarantie souhaités
    );

    public record ComparaisonDetailDto(
        Guid SessionId,
        CritereRechercheDto Criteres,
        List<OffreScoreeDto> Offres
    );

    public record SessionDto(
        Guid Id,
        DateTime CreatedAt,
        int NbOffres
    );
}
