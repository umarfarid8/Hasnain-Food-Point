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
var dbProvider = builder.Configuration["DatabaseProvider"] ?? "Sqlite";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (dbProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase) && 
        !string.IsNullOrEmpty(connectionString) && 
        !connectionString.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
    {
        options.UseSqlServer(connectionString);
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
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1)
    };
});

builder.Services.AddAuthorization();

var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin)) return false;
                var uri = new Uri(origin);
                return uri.Host == "localhost" ||
                       uri.Host == "127.0.0.1" ||
                       origin.StartsWith("capacitor://") ||
                       origin.StartsWith("http://localhost") ||
                       origin.StartsWith("https://localhost") ||
                       origin.EndsWith(".vercel.app") ||
                       origin.EndsWith(".netlify.app") ||
                       origin.EndsWith(".surge.sh") ||
                       configuredOrigins.Any(co => string.Equals(co.TrimEnd('/'), origin.TrimEnd('/'), StringComparison.OrdinalIgnoreCase));
            })
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Only redirect HTTPS when not behind a container proxy that already handles SSL
if (!app.Environment.IsProduction() || Environment.GetEnvironmentVariable("DISABLE_HTTPS_REDIRECT") != "true")
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Root & Health check endpoints
app.MapGet("/", () => Results.Ok(new
{
    name = "Hasnain Food Point API",
    status = "Online",
    version = "1.0",
    endpoints = new[] { "/api/menu", "/api/settings", "/api/admin/login", "/health" }
}));

app.MapGet("/health", () => Results.Ok(new
{
    status = "Healthy",
    timestamp = DateTime.UtcNow
}));

app.MapControllers();

app.Run();
