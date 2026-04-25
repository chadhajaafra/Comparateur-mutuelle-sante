using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Entities
{
    public class Mutuelle
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Nom { get; private set; } = string.Empty;
        public string Description { get; private set; } = string.Empty;
        public string Logo { get; private set; } = string.Empty;
        public string SiteWeb { get; private set; } = string.Empty;
        public bool IsActive { get; private set; } = true;
        public Guid AssureurId { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

        private readonly List<Offre> _offres = new();
        public IReadOnlyCollection<Offre> Offres => _offres.AsReadOnly();

        private Mutuelle() { }

        public static Mutuelle Create(string nom, string description, string logo, string siteWeb, Guid assureurId)
        {
            return new Mutuelle
            {
                Nom = nom.Trim(),
                Description = description.Trim(),
                Logo = logo,
                SiteWeb = siteWeb,
                AssureurId = assureurId
            };
        }

        public void Update(string nom, string description, string logo, string siteWeb)
        {
            Nom = nom.Trim();
            Description = description.Trim();
            Logo = logo;
            SiteWeb = siteWeb;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Activate() { IsActive = true; UpdatedAt = DateTime.UtcNow; }
        public void Deactivate() { IsActive = false; UpdatedAt = DateTime.UtcNow; }
    }
}
