using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Entities
{
    public record CritereRechercheExtrait(
    decimal? BudgetMax,
    int? NiveauSouhaite,      // 1=Eco, 2=Standard, 3=Premium
    List<int> TypesGarantie,  // IDs TypeGarantie
    string ReponseAssistant,  // message naturel à afficher dans le chat
    bool CriteresComplets     // false si l'IA a besoin de plus d'infos
);
}
