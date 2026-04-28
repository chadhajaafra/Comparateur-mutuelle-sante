using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Comparateur.Domain.Entities;
namespace Comparateur.Infrastructure.Persistence
{
    public class AppDbContext : DbContext, IUnitOfWork
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<Mutuelle> Mutuelles => Set<Mutuelle>();
        public DbSet<Offre>        Offres       => Set<Offre>();
        public DbSet<Garantie>     Garanties    => Set<Garantie>();
        public DbSet<OffreGarantie> OffreGaranties => Set<OffreGarantie>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }

}
