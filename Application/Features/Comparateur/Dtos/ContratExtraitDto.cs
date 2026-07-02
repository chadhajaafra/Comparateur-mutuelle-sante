using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Comparateur.Dtos
{
    public record ContratExtraitDto(
    string? AssureurNom,
    decimal? PrixMensuel,
    string? NiveauEstime,
    List<GarantieExtraiteDto> Garanties
);

    public record GarantieExtraiteDto(
        string Nom,
        int TypeGarantieEstime,
        decimal? TauxRemboursement,
        decimal? Plafond
    );

    public record AnalyseContratResultDto(
        ContratExtraitDto ContratActuel,
        List<OffreScoreeDto> MeilleuresAlternatives
    );
}
