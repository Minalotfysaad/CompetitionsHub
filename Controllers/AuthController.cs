using CompetitionsTest.DTOs.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(IServiceManager serviceManager)
        : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register(
            RegisterDto dto)
        {
            var id =await serviceManager.AuthService.RegisterAsync(dto);

            return Ok(id);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var id = await serviceManager.AuthService.LoginAsync(dto);

            return Ok(id);
        }
    }
}
