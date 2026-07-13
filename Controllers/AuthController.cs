using Microsoft.AspNetCore.Authorization;
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
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            try
            {
                var id = await serviceManager.AuthService.RegisterAsync(dto);
                return Ok(id);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            try
            {
                var response = await serviceManager.AuthService.LoginAsync(dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
