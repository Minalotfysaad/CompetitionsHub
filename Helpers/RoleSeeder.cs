using CompetitionsTest.Models.Identity;
using Microsoft.AspNetCore.Identity;

namespace CompetitionsTest.Helpers
{
    public static class RoleSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            string[] roles = { "admins", "contestants" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Seed an admin user if it doesn't exist
            var adminEmail = "admin@test.com";
            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName = "admin",
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, "Test@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "admins");
                }
            }
        }
    }
}
