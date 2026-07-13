using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CompetitionsTest.DTOs.Identity;
using CompetitionsTest.Models.Identity;
using CompetitionsTest.ServiceAbstractions;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;

namespace CompetitionsTest.Services
{
    public class AuthService(UserManager<ApplicationUser> userManager, IConfiguration configuration): IAuthService
    {
        public async Task<string> RegisterAsync(RegisterDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                Email = dto.Email
            };

            var result = await userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                throw new Exception(string.Join(",",result.Errors.Select(e => e.Description)));

            // Assign "contestants" role by default
            await userManager.AddToRoleAsync(user, "contestants");

            return user.Id;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);

            if (user is null)
                throw new Exception("Invalid credentials");

            bool valid = await userManager.CheckPasswordAsync(user, dto.Password);

            if (!valid)
                throw new Exception("Invalid credentials");

            var roles = await userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "contestants";

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.Role, role)
            };

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new AuthResponseDto
            {
                UserId = user.Id,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Role = role
            };
        }
    }
}
