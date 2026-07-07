using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Application.Features.Comparateur.Dtos
{
    public record ChatMessageDto(string Role, string Contenu); // Role: "user" | "assistant"

    public record ChatRechercheResultDto(
        string ReponseAssistant,
        bool CriteresComplets,
        CritereRechercheDto CriteresExtraits,
        List<OffreScoreeDto> OffresCorrespondantes
    );
}
