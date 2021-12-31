namespace IdentityService.Configuration
{
    public class Config
    {
        // ApiResources define the apis in your system
        public static IEnumerable<ApiResource> GetApis()
        {
            return new List<ApiResource>
            {
                new ApiResource("apigateway", "API Gateway"),
                new ApiResource("3dmodel", "3D Model Service"),
                new ApiResource("2dmodel", "2D Model Service"),
                new ApiResource("notification", "Notification Service"),
                new ApiResource("catalog", "Catalog Service"),
                new ApiResource("supplier", "Supplier Service"),
                new ApiResource("common", "Common Service"),
                new ApiResource("title24", "Title24 Service"),
                new ApiResource("spa", "SPA Client"),
                new ApiResource("mvc", "MVC Client"),
            };
        }

        // Identity resources are data like user ID, name, or email address of a user
        // see: http://docs.identityserver.io/en/release/configuration/resources.html
        public static IEnumerable<IdentityResource> GetResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };
        }

        // client want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients(Dictionary<string, string> clientsUrl)
        {
            return new List<Client>
            {
                // API Gateway
                new Client
                {
                    ClientId = "apigateway",
                    ClientSecrets =
                    {
                        new Secret("145A4D48-AEDA-49F4-A867-B90EBFD60B3E".Sha512())
                    },
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,  //{GrantType.Implicit, GrantType.Hybrid },
                    RedirectUris = { $"{clientsUrl["ApiGateway"]}/" },
                    AllowedScopes = {
                        "apigateway",
                        IdentityServerConstants.StandardScopes.OfflineAccess
                    },
                    AllowAccessTokensViaBrowser = true,
                    AllowOfflineAccess = true,
                    RequireConsent = false
                },
                // JavaScript Client - Single Page Application (Angular/React/Vue/Svelte)
                new Client
                {
                    ClientId = "spa",
                    ClientName = "AECInspire SPA OpenId Client",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris =           { $"{clientsUrl["Spa"]}/" },
                    RequireConsent = false,
                    PostLogoutRedirectUris = { $"{clientsUrl["Spa"]}/" },
                    AllowedCorsOrigins =     { $"{clientsUrl["Spa"]}" },
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "notification",
                        "3dmodel",
                        "2dmodel",
                        "catalog",
                    },
                },
                // MVC Client
                new Client
                {
                    ClientId = "mvc",
                    ClientName = "MVC Client",
                    ClientSecrets = new List<Secret>
                    {
                        new Secret("secret".Sha512())
                    },
                    ClientUri = $"{clientsUrl["Mvc"]}",                             // public uri of the client
                    AllowedGrantTypes = GrantTypes.Hybrid,
                    AllowAccessTokensViaBrowser = false,
                    RequireConsent = false,
                    AllowOfflineAccess = true,
                    AlwaysIncludeUserClaimsInIdToken = true,
                    RedirectUris = new List<string>
                    {
                        $"{clientsUrl["Mvc"]}/signin-oidc"
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        $"{clientsUrl["Mvc"]}/signout-callback-oidc"
                    },
                    AllowedScopes = new List<string>
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        IdentityServerConstants.StandardScopes.OfflineAccess,
                        "notification",
                        "3dmodel",
                        "2dmodel",
                        "catalog",
                    },
                    AccessTokenLifetime = 60*60*2, // 2 hours
                    IdentityTokenLifetime= 60*60*2 // 2 hours
                }
            };
        }
    }
}