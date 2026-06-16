using CompetitionsTest.DTOs.Identity;
using CompetitionsTest.Models.Identity;
using CompetitionsTest.ServiceAbstractions;
using Microsoft.AspNetCore.Identity;

namespace CompetitionsTest.Services
{
    public class AuthService(UserManager<ApplicationUser> userManager): IAuthService
    {
        public async Task<string> RegisterAsync(RegisterDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                Email = dto.Email
            };

            var result =
                await userManager.CreateAsync(
                    user,
                    dto.Password);

            if (!result.Succeeded)
                throw new Exception(
                    string.Join(",",
                    result.Errors.Select(e => e.Description)));

            return user.Id;
        }

        public async Task<string> LoginAsync(LoginDto dto)
        {
            var user =
                await userManager.FindByEmailAsync(dto.Email);

            if (user is null)
                throw new Exception("Invalid credentials");

            bool valid =
                await userManager.CheckPasswordAsync(
                    user,
                    dto.Password);

            if (!valid)
                throw new Exception("Invalid credentials");

            return user.Id;
        }
    }
}
