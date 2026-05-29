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
    public class MutuelleConfiguration : IEntityTypeConfiguration<Mutuelle>
    {
        public void Configure(EntityTypeBuilder<Mutuelle> builder)
        {
            builder.HasKey(m => m.Id);
            builder.Property(m => m.Nom).IsRequired().HasMaxLength(200);
            builder.Property(m => m.Description).IsRequired().HasMaxLength(2000);
            builder.Property(m => m.Logo).HasMaxLength(2000);
            builder.Property(m => m.SiteWeb).HasMaxLength(300);
            builder.HasIndex(m => m.Nom);
            builder.HasIndex(m => m.AssureurId);

            builder.HasMany(m => m.Offres)
                   .WithOne(o => o.Mutuelle)
                   .HasForeignKey(o => o.MutuelleId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class OffreConfiguration : IEntityTypeConfiguration<Offre>
    {
        public void Configure(EntityTypeBuilder<Offre> builder)
        {
            builder.HasKey(o => o.Id);
            builder.Property(o => o.Nom).IsRequired().HasMaxLength(200);
            builder.Property(o => o.PrixMensuel).HasPrecision(10, 2);
            builder.Property(o => o.Niveau).IsRequired();
            builder.HasIndex(o => o.MutuelleId);
            builder.HasIndex(o => o.Niveau);

            builder.HasMany(o => o.OffreGaranties)
                   .WithOne(og => og.Offre)
                   .HasForeignKey(og => og.OffreId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class GarantieConfiguration : IEntityTypeConfiguration<Garantie>
    {
        public void Configure(EntityTypeBuilder<Garantie> builder)
        {
            builder.HasKey(g => g.Id);
            builder.Property(g => g.Nom).IsRequired().HasMaxLength(200);
            builder.Property(g => g.Type).IsRequired();
            builder.HasIndex(g => g.Type);
        }
    }

    public class OffreGarantieConfiguration : IEntityTypeConfiguration<OffreGarantie>
    {
        public void Configure(EntityTypeBuilder<OffreGarantie> builder)
        {
            // Clé composite
            builder.HasKey(og => new { og.OffreId, og.GarantieId });
            builder.Property(og => og.TauxRemboursement).IsRequired();
            builder.Property(og => og.Details).HasMaxLength(500);

            builder.HasOne(og => og.Garantie)
                   .WithMany(g => g.OffreGaranties)
                   .HasForeignKey(og => og.GarantieId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
