using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using HasnainFoodPoint.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure Forwarded Headers for reverse proxy hosting (Render, Azure App Service, Docker)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var dbProvider = builder.Configuration["DatabaseProvider"] ?? "SqlServer";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (dbProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase) ||
        (!string.IsNullOrEmpty(connectionString) && !connectionString.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase)))
    {
        if (!string.IsNullOrEmpty(connectionString))
        {
            options.UseSqlServer(connectionString, sqlServerOptions =>
            {
                sqlServerOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null);
            });
        }
        else
        {
            var fallbackConn = builder.Configuration.GetConnectionString("SqlServerConnection")
                ?? "Server=(localdb)\\mssqllocaldb;Database=HasnainFoodPointDb;Trusted_Connection=True;MultipleActiveResultSets=true";
            options.UseSqlServer(fallbackConn, sqlServerOptions =>
            {
                sqlServerOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null);
            });
        }
    }
    else
    {
        var sqliteConn = string.IsNullOrWhiteSpace(connectionString) || !connectionString.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase)
            ? "Data Source=hasnain_food_point.db"
            : connectionString;
        options.UseSqlite(sqliteConn);
    }
});

// Configure JWT Authentication
var jwtSecret = builder.Configuration["AdminSettings:JwtSecret"] 
    ?? "HasnainFoodPoint_Default_Super_Secret_Admin_Key_2026_Min32Bytes";
var jwtIssuer = builder.Configuration["AdminSettings:JwtIssuer"] ?? "HasnainFoodPointApi";
var jwtAudience = builder.Configuration["AdminSettings:JwtAudience"] ?? "HasnainFoodPointAdmin";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(10)
    };
});

builder.Services.AddAuthorization();

var configuredOrigins = (builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? builder.Configuration["Cors:AllowedOrigins"]?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? Array.Empty<string>())
    .Select(o => o.TrimEnd('/'))
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin)) return false;
                var cleanOrigin = origin.TrimEnd('/');
                try
                {
                    var uri = new Uri(origin);
                    return uri.Host == "localhost" ||
                           uri.Host == "127.0.0.1" ||
                           uri.Host.Equals("hasnainfoodpoint.netlify.app", StringComparison.OrdinalIgnoreCase) ||
                           cleanOrigin.Equals("https://hasnainfoodpoint.netlify.app", StringComparison.OrdinalIgnoreCase) ||
                           origin.StartsWith("capacitor://", StringComparison.OrdinalIgnoreCase) ||
                           origin.StartsWith("http://localhost", StringComparison.OrdinalIgnoreCase) ||
                           origin.StartsWith("https://localhost", StringComparison.OrdinalIgnoreCase) ||
                           origin.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase) ||
                           origin.EndsWith(".netlify.app", StringComparison.OrdinalIgnoreCase) ||
                           origin.EndsWith(".surge.sh", StringComparison.OrdinalIgnoreCase) ||
                           configuredOrigins.Any(co => string.Equals(co, cleanOrigin, StringComparison.OrdinalIgnoreCase));
                }
                catch
                {
                    return configuredOrigins.Any(co => string.Equals(co, cleanOrigin, StringComparison.OrdinalIgnoreCase));
                }
            })
            .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
            .WithHeaders("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hasnain Food Point API",
        Version = "v1",
        Description = "API for Hasnain Food Point menu, settings, and admin management"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT Bearer token obtained from POST /api/admin/login"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

app.UseForwardedHeaders();

// Auto-apply migrations and seed data on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        await SeedData.InitializeAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}

// Enable Swagger in development and production for easy API testing
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Hasnain Food Point API v1");
    options.RoutePrefix = "swagger";
});

// Only redirect HTTPS when not behind a container proxy that already handles SSL
if (!app.Environment.IsProduction() || Environment.GetEnvironmentVariable("DISABLE_HTTPS_REDIRECT") != "true")
{
    app.UseHttpsRedirection();
}

// Middleware Order: UseRouting -> UseCors -> UseAuthentication -> UseAuthorization -> Endpoints
app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Root & Health check endpoints
app.MapGet("/", () => Results.Ok(new
{
    name = "Hasnain Food Point API",
    status = "Online",
    version = "1.0",
    swagger = "/swagger",
    endpoints = new[] { "/swagger", "/api/menu", "/api/settings", "/api/admin/login", "/health" }
}));

app.MapGet("/health", () => Results.Ok(new
{
    status = "Healthy",
    timestamp = DateTime.UtcNow
}));

app.MapControllers();

app.Run();
