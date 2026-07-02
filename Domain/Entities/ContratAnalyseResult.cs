using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Entities
{
    public record ContratAnalyseResult(
      string? AssureurNom,
      decimal? PrixMensuel,
      string? NiveauEstime,
      List<GarantieAnalysee> Garanties
  );

    public record GarantieAnalysee(
        string Nom,
        int TypeGarantieEstime,
        decimal? TauxRemboursement,
        decimal? Plafond
    );
}
