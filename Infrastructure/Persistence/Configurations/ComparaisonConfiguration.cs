using Comparateur.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Infrastructure.Persistence.Configurations
{
    public class ComparaisonSessionConfiguration : IEntityTypeConfiguration<ComparaisonSession>
    {
        public void Configure(EntityTypeBuilder<ComparaisonSession> b)
        {
            b.HasKey(s => s.Id);
            b.Property(s => s.SessionToken).HasMaxLength(200);
            b.Property(s => s.TypesGarantieSouhaites).HasMaxLength(200);
            b.HasIndex(s => s.UserId);
            b.HasIndex(s => s.SessionToken);
            b.HasMany(s => s.Items).WithOne(i => i.Session)
             .HasForeignKey(i => i.SessionId).OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class ComparaisonItemConfiguration : IEntityTypeConfiguration<ComparaisonItem>
    {
        public void Configure(EntityTypeBuilder<ComparaisonItem> b)
        {
            b.HasKey(i => i.Id);
            b.Property(i => i.Position).IsRequired();
            b.HasOne(i => i.Offre).WithMany()
             .HasForeignKey(i => i.OffreId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
