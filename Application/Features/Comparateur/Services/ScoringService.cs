using Comparateur.Application.Features.Comparateur.Dtos;
using Comparateur.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Comparateur.Services
{
    public static class ScoringService
    {
        // Score global = 40% prix + 30% niveau + 30% garanties
        public static int CalculerScore(Offre offre, CritereRechercheDto criteres)
        {
            int scorePrix = ScorePrix(offre.PrixMensuel, criteres.BudgetMax);
            int scoreNiveau = ScoreNiveau((int)offre.Niveau, criteres.NiveauSouhaite);
            int scoreGaranties = ScoreGaranties(offre.OffreGaranties, criteres.TypesGarantie); // OK
            return (int)(scorePrix * 0.4 + scoreNiveau * 0.3 + scoreGaranties * 0.3);
        }
        private static int ScorePrix(decimal prix, int? budgetMax)
        {
            if (budgetMax is null) return 70; // neutre si pas de budget
            if (prix <= 0) return 100;

            double ratio = (double)prix / budgetMax.Value;
            if (ratio <= 0.7) return 100;
            if (ratio <= 0.85) return 85;
            if (ratio <= 1.0) return 70;
            if (ratio <= 1.15) return 45;
            if (ratio <= 1.3) return 20;
            return 0;
        }

        private static int ScoreNiveau(int niveauOffre, int? niveauSouhaite)
        {
            if (niveauSouhaite is null) return 70;
            int diff = niveauOffre - niveauSouhaite.Value;
            return diff switch
            {
                0 => 100,
                1 => 75,   // un cran au-dessus
                -1 => 50,   // un cran en dessous
                _ => 20,
            };
        }

        private static int ScoreGaranties(
        IEnumerable<OffreGarantie> garanties,
            List<int>? typesSouhaites)
        {
            if (typesSouhaites is null or { Count: 0 }) return 70;

            int matchees = garanties.Count(og =>
                typesSouhaites.Contains((int)og.Garantie.Type));

            return (int)((double)matchees / typesSouhaites.Count * 100);
        }

        public static int ScorePrixPublic(decimal prix, int? budgetMax) => ScorePrix(prix, budgetMax);
        public static int ScoreNiveauPublic(int niveau, int? souhaite) => ScoreNiveau(niveau, souhaite);
        public static int ScoreGarantiesPublic(IEnumerable<OffreGarantie> g, List<int>? types) => ScoreGaranties(g, types);
        public static OffreScoreeDto MapToScored(Offre o, CritereRechercheDto criteres)
        {
            var typesSouhaites = criteres.TypesGarantie ?? new();
            int scoreTotal = CalculerScore(o, criteres);
            int scorePrix = ScorePrix(o.PrixMensuel, criteres.BudgetMax);
            int scoreNiveau = ScoreNiveau((int)o.Niveau, criteres.NiveauSouhaite);
            int scoreGaranties = ScoreGaranties(o.OffreGaranties, criteres.TypesGarantie);

            return new OffreScoreeDto(
                Id: o.Id,
                Nom: o.Nom,
                Niveau: (int)o.Niveau,
                NiveauLabel: o.Niveau.ToString(),
                PrixMensuel: o.PrixMensuel,
                MutuelleId: o.MutuelleId,
                MutuelleNom: o.Mutuelle.Nom,
                MutuelleLogo: o.Mutuelle.Logo,
                ScoreTotal: scoreTotal,
                ScorePrix: scorePrix,
                ScoreNiveau: scoreNiveau,
                ScoreGaranties: scoreGaranties,
                Garanties: o.OffreGaranties.Select(og => new GarantieScoreDto(
                    GarantieId: og.GarantieId,
                    Nom: og.Garantie.Nom,
                    Type: og.Garantie.Type.ToString(),
                    TauxRemboursement: og.TauxRemboursement,
                    Plafond: og.Plafond,
                    MatchCritere: typesSouhaites.Contains((int)og.Garantie.Type)
                )).ToList()
            );
        }
    }
}
