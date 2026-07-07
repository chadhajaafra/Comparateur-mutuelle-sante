using Comparateur.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Interfaces
{
    public interface IAssistantRechercheService
    {
        Task<CritereRechercheExtrait> AnalyserMessageAsync(
            string message,
            List<(string Role, string Contenu)> historique,
            CancellationToken ct);
    }
}
