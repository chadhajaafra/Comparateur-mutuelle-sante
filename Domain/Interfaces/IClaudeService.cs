using Comparateur.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Interfaces
{
    public interface IClaudeService
    {
        Task<ContratAnalyseResult> AnalyserContratAsync(string texteContrat, CancellationToken ct);

    }
}
