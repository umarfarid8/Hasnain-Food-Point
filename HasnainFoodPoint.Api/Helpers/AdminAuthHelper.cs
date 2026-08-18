using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace HasnainFoodPoint.Api.Helpers;

public static class AdminAuthHelper
{
    public static string ComputeSha256Hash(string rawData)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawData));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    public static bool VerifyPassword(string inputPassword, IConfiguration configuration)
    {
        if (string.IsNullOrWhiteSpace(inputPassword))
        {
            return false;
        }

        var configuredHash = configuration["AdminSettings:PasswordHash"]
            ?? configuration["AdminSettings:Password"];

        if (string.IsNullOrWhiteSpace(configuredHash))
        {
            return false;
        }

        var inputHash = ComputeSha256Hash(inputPassword);

        // Constant-time comparison for security
        var inputBytes = Encoding.UTF8.GetBytes(inputHash);
        var targetBytes = Encoding.UTF8.GetBytes(configuredHash.Trim().ToLowerInvariant());

        if (inputBytes.Length == targetBytes.Length && CryptographicOperations.FixedTimeEquals(inputBytes, targetBytes))
        {
            return true;
        }

        // Fallback: if plaintext was provided in dev settings
        var plainBytes = Encoding.UTF8.GetBytes(inputPassword);
        var configBytes = Encoding.UTF8.GetBytes(configuredHash.Trim());
        if (plainBytes.Length == configBytes.Length && CryptographicOperations.FixedTimeEquals(plainBytes, configBytes))
        {
            return true;
        }

        return false;
    }

    public static (string Token, int ExpiresIn, DateTime ExpiresAt) GenerateJwtToken(IConfiguration configuration)
    {
        var secret = configuration["AdminSettings:JwtSecret"] 
            ?? "HasnainFoodPoint_Default_Super_Secret_Admin_Key_2026_Min32Bytes";
        var issuer = configuration["AdminSettings:JwtIssuer"] ?? "HasnainFoodPointApi";
        var audience = configuration["AdminSettings:JwtAudience"] ?? "HasnainFoodPointAdmin";
        
        var expiryMinutesStr = configuration["AdminSettings:TokenExpiryMinutes"];
        var expiryMinutes = int.TryParse(expiryMinutesStr, out var parsed) ? parsed : 120;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, "admin"),
            new Claim(ClaimTypes.Name, "Admin"),
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAt,
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        var expiresInSeconds = expiryMinutes * 60;

        return (tokenString, expiresInSeconds, expiresAt);
    }
}
