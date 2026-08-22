using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HasnainFoodPoint.Api.Data;
using HasnainFoodPoint.Api.DTOs;

namespace HasnainFoodPoint.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowFrontend")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SettingsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves the business settings, contact info (WhatsApp), and owner profile.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<SettingsDto>> GetSettings()
    {
        var settings = await _context.BusinessInfos
            .AsNoTracking()
            .OrderBy(b => b.Id)
            .Select(b => new SettingsDto
            {
                Name = b.Name,
                Tagline = b.Tagline,
                WhatsAppNumber = b.WhatsAppNumber,
                WhatsAppRawNumber = b.WhatsAppRawNumber,
                Address = b.Address,
                OpeningHours = b.OpeningHours,
                MapUrl = b.MapUrl,
                OwnerName = b.OwnerName,
                OwnerStory = b.OwnerStory,
                OwnerPhotoUrl = b.OwnerPhotoUrl
            })
            .FirstOrDefaultAsync();

        if (settings == null)
        {
            return NotFound(new { message = "Settings not configured." });
        }

        return Ok(settings);
    }
}
