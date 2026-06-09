using Comparateur.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Interfaces
{
    public interface IOfffreRepository
    {
        Task<List<Offre>> GetAllActiveWithGarantiesAsync(string? search,int? niveau,List<int>? typesGarantie,CancellationToken ct = default);
    }
}
