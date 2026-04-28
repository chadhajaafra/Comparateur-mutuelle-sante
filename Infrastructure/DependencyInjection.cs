using Application.Common;
using Comparateur.Infrastructure.Persistence.Repositories;
using Comparateur.Infrastructure.Persistence;
using Comparateur.Infrastructure.Services;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Comparateur.Domain.Interfaces;

namespace Comparateur.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            // Base de données
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(config.GetConnectionString("DefaultConnection")));

            // UnitOfWork
            services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<AppDbContext>());

            // Repositories
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

            // Services
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IMutuelleRepository, MutuelleRepository>();
            services.AddScoped<IOffreRepository,    OffreRepository>();
            services.AddScoped<IGarantieRepository, GarantieRepository>();
            return services;
        }
    }
}
