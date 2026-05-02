using Comparateur.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Comparateur.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GarantiesController : ControllerBase
    {
        private readonly IGarantieRepository _repo;

        public GarantiesController(IGarantieRepository repo) => _repo = repo;

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await _repo.GetAllAsync(ct));
    }
}
