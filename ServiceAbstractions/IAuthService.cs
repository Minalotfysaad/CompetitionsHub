using CompetitionsTest.DTOs.Identity;

namespace CompetitionsTest.ServiceAbstractions
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    }
}
