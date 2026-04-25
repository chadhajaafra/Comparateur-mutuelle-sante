using Comparateur.Domain.Entities;
using Comparateur.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Interfaces
{
    public interface IMutuelleRepository
    {
        Task<Mutuelle?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<Mutuelle?> GetByIdWithOffresAsync(Guid id, CancellationToken ct = default);
        Task<(List<Mutuelle> Items, int Total)> GetAllAsync(MutuelleFilter filter, CancellationToken ct = default);
        Task<List<Mutuelle>> GetByAssureurAsync(Guid assureurId, CancellationToken ct = default);
        Task CreateAsync(Mutuelle mutuelle, CancellationToken ct = default);
        Task UpdateAsync(Mutuelle mutuelle, CancellationToken ct = default);
        Task<bool> ExistsAsync(Guid id, CancellationToken ct = default);
    }

    public interface IOffreRepository
    {
        Task<Offre?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<Offre?> GetByIdWithGarantiesAsync(Guid id, CancellationToken ct = default);
        Task<List<Offre>> GetByMutuelleAsync(Guid mutuelleId, CancellationToken ct = default);
        Task CreateAsync(Offre offre, CancellationToken ct = default);
        Task UpdateAsync(Offre offre, CancellationToken ct = default);
    }

    public interface IGarantieRepository
    {
        Task<Garantie?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<List<Garantie>> GetAllAsync(CancellationToken ct = default);
        Task<List<Garantie>> GetByTypeAsync(TypeGarantie type, CancellationToken ct = default);
        Task CreateAsync(Garantie garantie, CancellationToken ct = default);
        Task UpdateAsync(Garantie garantie, CancellationToken ct = default);
    }

    // Filtre de recherche
    public record MutuelleFilter(
        string? Search = null,
        TypeGarantie? TypeGarantie = null,
        NiveauCouverture? Niveau = null,
        decimal? PrixMin = null,
        decimal? PrixMax = null,
        bool? IsActive = true,
        Guid? AssureurId = null,
        int Page = 1,
        int PageSize = 10
    );
}
