using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Entities
{
    public class ComparaisonItem
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public Guid SessionId { get; private set; }
        public Guid OffreId { get; private set; }
        public int Position { get; private set; }   // 1, 2 ou 3
        public DateTime AddedAt { get; private set; } = DateTime.UtcNow;

        public ComparaisonSession Session { get; private set; } = null!;
        public Offre Offre { get; private set; } = null!;

        private ComparaisonItem() { }

        public static ComparaisonItem Create(Guid sessionId, Guid offreId, int position) =>
            new() { SessionId = sessionId, OffreId = offreId, Position = position };
        public void UpdatePosition(int position) => Position = position;

    }
}
