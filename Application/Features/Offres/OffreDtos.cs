using Comparateur.Application.Features.Mutuelles;
using Comparateur.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Offres
{
    public record OffreDto(
      Guid Id,
      string Nom,
      NiveauCouverture Niveau,
      decimal PrixMensuel,
      string? Description,
      bool IsActive,
      List<OffreGarantieDto> Garanties
  );
}
