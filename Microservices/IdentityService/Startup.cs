using IdentityService.Helpers;
using IdentityService.HttpHelpers;

using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

using System.Net.Mime;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace IdentityService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            #region Read appsettings.json

            services.AddOptions();
            services.Configure<AppSettings>(Configuration);
            var appSettings = Configuration.Get<AppSettings>();

            #endregion Read appsettings.json

            var connectionString = appSettings.ConnectionString;
            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            // RegisterAppInsights(services);

            #region HealthCheck

            services.AddHealthChecks()
                .AddCheck("self", () => HealthCheckResult.Healthy())
                .AddNpgSql(appSettings.ConnectionString,
                    name: "IdentityDB-check",
                    tags: new string[] { "IdentityDB" });

            #endregion HealthCheck

            #region CORS - Cross-Origin Resource Sharing

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins(appSettings.CorsOrigins)
                    .SetIsOriginAllowedToAllowWildcardSubdomains()
                    .AllowCredentials()
                    .AllowAnyMethod()
                    //.WithMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                    .AllowAnyHeader();
                });
            });

            #endregion CORS - Cross-Origin Resource Sharing

            //services.AddTransient<ILoginService<ApplicationUser>, EFLoginService>();
            //services.AddTransient<IRedirectService, RedirectService>();

            #region Add framework services.

            services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString,
                npgsqlOptionsAction: sqlOptions =>
                {
                    sqlOptions.MigrationsAssembly(migrationsAssembly);
                    sqlOptions.EnableRetryOnFailure(maxRetryCount: 15, maxRetryDelay: TimeSpan.FromSeconds(30), errorCodesToAdd: null);
                    sqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                }));

            services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                //options.SignIn.RequireConfirmedAccount = true;
                //options.SignIn.RequireConfirmedEmail = true;
                options.User.RequireUniqueEmail = true;
            })
            .AddRoles<ApplicationRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();
            services.Configure<PasswordHasherOptions>(options => options.IterationCount = 3_10_000);

            #endregion Add framework services.

            // Adds IdentityServer
            services.AddIdentityServer(x =>
            {
                // x.IssuerUri = "null";
                x.Authentication.CookieLifetime = TimeSpan.FromHours(2);
            })
            //.AddDevspacesIfNeeded(appSettings.EnableDevspaces, false))
            .AddSigningCredential(Certificate.Get(), "RS512")
            .AddAspNetIdentity<ApplicationUser>()
            //.AddValidationKey(Certificate.Get(), "RS512")
            .AddConfigurationStore(options =>
            {
                options.ConfigureDbContext = builder => builder.UseNpgsql(connectionString,
                    npgsqlOptionsAction: sqlOptions =>
                    {
                        sqlOptions.MigrationsAssembly(migrationsAssembly);
                        sqlOptions.EnableRetryOnFailure(maxRetryCount: 15, maxRetryDelay: TimeSpan.FromSeconds(30), errorCodesToAdd: null);
                        sqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    });
            })
            .AddOperationalStore(options =>
            {
                options.ConfigureDbContext = builder => builder.UseNpgsql(connectionString,
                    npgsqlOptionsAction: sqlOptions =>
                    {
                        sqlOptions.MigrationsAssembly(migrationsAssembly);
                        sqlOptions.EnableRetryOnFailure(maxRetryCount: 15, maxRetryDelay: TimeSpan.FromSeconds(30), errorCodesToAdd: null);
                        sqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    });
            });
            //.Services.AddTransient<IProfileService, ProfileService>();

            #region DataProtection

            var dataProtectionBuilder = services.AddDataProtection(opts =>
            {
                opts.ApplicationDiscriminator = "sanveo.identity";
            })
            .SetDefaultKeyLifetime(TimeSpan.FromDays(7));
            if (appSettings.IsClusterEnv == bool.TrueString)
            {
                dataProtectionBuilder
                    .PersistKeysToStackExchangeRedis(ConnectionMultiplexer.Connect(appSettings.RedisCache?.HostAndPort), "DataProtection-Keys");
            }
            else
            {
                dataProtectionBuilder
                    .PersistKeysToDbContext<ApplicationDbContext>();
            }

            #endregion DataProtection

            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            services.AddControllers(options =>
            {
                options.Conventions.Add(new RouteTokenTransformerConvention(new SlugifyParameterTransformer()));
            })
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var result = new ValidationFailedResult(actionContext.ModelState);
                    result.ContentTypes.Add(MediaTypeNames.Application.Json);
                    return result;
                };
                //options.SuppressConsumesConstraintForFormFileParameters = true;
                //options.SuppressInferBindingSourcesForParameters = true;
                //options.SuppressModelStateInvalidFilter = false;    // this should be FALSE to send correct ModelState errors
                //options.SuppressMapClientErrors = true;
                //options.ClientErrorMapping[StatusCodes.Status404NotFound].Link = "https://httpstatuses.com/404";
            })
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                options.JsonSerializerOptions.AllowTrailingCommas = true;
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });
            //services.AddRouting(options => options.LowercaseUrls = true);

            //services.AddControllersWithViews();
            //services.AddRazorPages();
            services.AddSwaggerGen();

            var container = new ContainerBuilder();
            container.Populate(services);

            #region Redis cache

            // services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(appSettings.RedisCache.HostAndPort));

            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = appSettings.RedisCache?.HostAndPort;
                //",abortConnect = False"
                options.InstanceName = appSettings.RedisCache?.InstanceName;
            });

            #endregion Redis cache

            return new AutofacServiceProvider(container.Build());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env/*, ILoggerFactory loggerFactory*/)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            var pathBase = Configuration["PATH_BASE"];
            if (!string.IsNullOrEmpty(pathBase))
            {
                //loggerFactory.CreateLogger<Startup>().LogDebug("Using PATH BASE '{pathBase}'", pathBase);
                app.UsePathBase(pathBase);
            }

            app.UseStaticFiles();

            // Make work identity server redirections in Edge and lastest versions of browers. WARN: Not valid in a production environment.
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Add("Content-Security-Policy", "script-src 'unsafe-inline'");
                await next();
            });

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            // Adds IdentityServer
            app.UseIdentityServer();

            app.UseCors();
            app.UseSerilogRequestLogging();
            app.UseHttpsRedirection();

            // Fix a problem with chrome. Chrome enabled a new feature "Cookies without SameSite must be secure",
            // the coockies shold be expided from https, but in identityservice, the internal comunicacion in aks and docker compose is http.
            // To avoid this problem, the policy of cookies shold be in Lax mode.
            app.UseCookiePolicy(new CookiePolicyOptions { MinimumSameSitePolicy = SameSiteMode.Lax });
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/hc", new HealthCheckOptions()
                {
                    Predicate = _ => true,
                    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
                });
                endpoints.MapHealthChecks("/liveness", new HealthCheckOptions
                {
                    Predicate = r => r.Name.Contains("self")
                });
            });
        }

        //private void RegisterAppInsights(IServiceCollection services)
        //{
        //    services.AddApplicationInsightsTelemetry(Configuration);
        //    services.AddApplicationInsightsKubernetesEnricher();
        //}
    }
}