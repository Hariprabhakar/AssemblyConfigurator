global using Autofac;
global using Autofac.Extensions.DependencyInjection;

global using HealthChecks.UI.Client;

global using IdentityServer4;
global using IdentityServer4.EntityFramework.DbContexts;
global using IdentityServer4.EntityFramework.Mappers;
global using IdentityServer4.EntityFramework.Options;
global using IdentityServer4.Models;

global using IdentityService;
global using IdentityService.Certificates;
global using IdentityService.Configuration;
global using IdentityService.Data;
global using IdentityService.Extensions;
global using IdentityService.Models;

global using Microsoft.AspNetCore;
global using Microsoft.AspNetCore.Builder;
global using Microsoft.AspNetCore.Diagnostics.HealthChecks;
global using Microsoft.AspNetCore.Hosting;
global using Microsoft.AspNetCore.Identity;
global using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.EntityFrameworkCore.Design;
global using Microsoft.EntityFrameworkCore.Infrastructure;
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Diagnostics.HealthChecks;
global using Microsoft.Extensions.Hosting;
global using Microsoft.Extensions.Logging;
global using Microsoft.Extensions.Options;

global using Polly;

global using Serilog;

global using StackExchange.Redis;

global using System;
global using System.Collections.Generic;
global using System.IO;
global using System.Linq;
global using System.Reflection;
global using System.Security.Cryptography.X509Certificates;
global using System.Text.RegularExpressions;
global using System.Threading.Tasks;