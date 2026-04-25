using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Entities
{
    public class OffreGarantie
    {
        public Guid OffreId { get; private set; }
        public Guid GarantieId { get; private set; }
        public int TauxRemboursement { get; private set; }
        public int? Plafond { get; private set; }
        public string? Details { get; private set; }

        public Offre Offre { get; private set; } = null!;
        public Garantie Garantie { get; private set; } = null!;

        private OffreGarantie() { }

        public static OffreGarantie Create(Guid offreId, Guid garantieId, int taux, int? plafond = null, string? details = null)
        {
            return new OffreGarantie
            {
                OffreId = offreId,
                GarantieId = garantieId,
                TauxRemboursement = taux,
                Plafond = plafond,
                Details = details
            };
        }

        public void Update(int taux, int? plafond, string? details)
        {
            TauxRemboursement = taux;
            Plafond = plafond;
            Details = details;
        }
    }
}
