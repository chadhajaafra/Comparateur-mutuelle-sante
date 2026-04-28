using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Enums
{
    public enum NiveauCouverture
    {
        Eco = 1,
        Standard = 2,
        Premium = 3
    }

    public enum TypeGarantie
    {
        SanteGenerale = 1,
        Dentaire = 2,
        Optique = 3,
        Hospitalisation = 4,
        Maternite = 5,
        MedecineDouces = 6
    }

    public enum StatutMutuelle
    {
        Active = 1,
        Inactive = 2,
        EnAttente = 3
    }

}
