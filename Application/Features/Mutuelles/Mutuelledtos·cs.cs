using Comparateur.Application.Features.Offres;
using Comparateur.Domain.Entities;
using Comparateur.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Mutuelles
{
    // ── DTOs de réponse ────────────────────────────────────────────────────────
    public record MutuelleDto(
        Guid Id,
        string Nom,
        string Description,
        string Logo,
        string SiteWeb,
        bool IsActive,
        Guid AssureurId,
        List<OffreDto> Offres
    );

  

    public record OffreGarantieDto(
        Guid GarantieId,
        string GarantieNom,
        string GarantieType,
        int TauxRemboursement,
        int? Plafond,
        string? Details
    );

    public record MutuelleListItemDto(
        Guid Id,
        string Nom,
        string Logo,
        bool IsActive,
        decimal PrixMin,
        decimal PrixMax,
        int NbOffres,
        List<string> TypesGaranties
    );

    public record PagedResult<T>(
        List<T> Items,
        int Total,
        int Page,
        int PageSize,
        int TotalPages
    );
}
