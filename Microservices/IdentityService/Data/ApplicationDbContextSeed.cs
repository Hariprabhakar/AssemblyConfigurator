namespace IdentityService.Data
{
    using Microsoft.Extensions.Logging;

    public class ApplicationDbContextSeed
    {
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher =
            new PasswordHasher<ApplicationUser>();

        public async Task SeedAsync(IServiceProvider services, ApplicationDbContext context, IWebHostEnvironment env,
            ILogger<ApplicationDbContextSeed> logger, IOptions<AppSettings> settings, int? retry = 0)
        {
            int retryForAvaiability = retry ?? 0;

            try
            {
                var contentRootPath = env.ContentRootPath;
                var webroot = env.WebRootPath;

                if (!context.Roles.Any())
                {
                    context.Roles.AddRange(GetDefaultRoles());
                    await context.SaveChangesAsync();
                }
                if (!context.Users.Any())
                {
                    context.Users.AddRange(GetDefaultUser());
                    await context.SaveChangesAsync();
                    await AssignRoles(services, "admin@sanveo.com", new[] { "SuperAdmin" });
                }
            }
            catch (Exception ex)
            {
                if (retryForAvaiability < 10)
                {
                    retryForAvaiability++;

                    logger.LogError(ex, "EXCEPTION ERROR while migrating {DbContextName}", nameof(ApplicationDbContext));

                    await SeedAsync(services, context, env, logger, settings, retryForAvaiability);
                }
            }
        }

        private IEnumerable<ApplicationUser> GetDefaultUser()
        {
            var user =
            new ApplicationUser()
            {
                UserName = "superadmin",
                Email = "admin@sanveo.com",
                FirstName = "Super",
                LastName = "Admin",
                PhoneNumber = "1234567890",
                NormalizedEmail = "ADMIN@SANVEO.COM",
                NormalizedUserName = "SUPERADMIN",
                SecurityStamp = Guid.NewGuid().ToString("D"),
                EmailConfirmed = true
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, "Newark!25");

            return new List<ApplicationUser>()
            {
                user
            };
        }

        private static IEnumerable<ApplicationRole> GetDefaultRoles()
        {
            return new List<ApplicationRole>()
            {
                new ApplicationRole()
                {
                    Name = "SuperAdmin",
                    NormalizedName = "SUPERADMIN"
                },
                new ApplicationRole()
                {
                    Name = "CompanyAdmin",
                    NormalizedName = "COMPANYADMIN"
                },
                new ApplicationRole()
                {
                    Name = "StandardUsers",
                    NormalizedName = "STANDARDUSERS"
                }
            };
        }

        public static async Task<IdentityResult> AssignRoles(IServiceProvider services, string email, string[] roles)
        {
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
            UserManager<ApplicationUser> _userManager = services.GetService<UserManager<ApplicationUser>>();
#pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            ApplicationUser user = await _userManager.FindByEmailAsync(email);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
            var result = await _userManager.AddToRolesAsync(user, roles);

            return result;
        }
    }
}