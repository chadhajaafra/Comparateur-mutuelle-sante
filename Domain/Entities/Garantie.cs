using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Comparateur.Domain.Enums;

namespace Comparateur.Domain.Entities
{

    public class Garantie
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Nom { get; private set; } = string.Empty;
        public TypeGarantie Type { get; private set; }
        public string? Description { get; private set; }
        public string? Icone { get; private set; }

        private readonly List<OffreGarantie> _offreGaranties = new();
        public IReadOnlyCollection<OffreGarantie> OffreGaranties => _offreGaranties.AsReadOnly();

        private Garantie() { }

        public static Garantie Create(string nom, TypeGarantie type, string? description = null, string? icone = null)
        {
            return new Garantie
            {
                Nom = nom.Trim(),
                Type = type,
                Description = description,
                Icone = icone
            };
        }

        public void Update(string nom, TypeGarantie type, string? description, string? icone)
        {
            Nom = nom.Trim();
            Type = type;
            Description = description;
            Icone = icone;
        }
    }
}
