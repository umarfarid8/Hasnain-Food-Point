using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HasnainFoodPoint.Api.Data;
using HasnainFoodPoint.Api.DTOs;
using HasnainFoodPoint.Api.Helpers;

namespace HasnainFoodPoint.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AdminController> _logger;

    public AdminController(AppDbContext context, IConfiguration configuration, ILogger<AdminController> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Authenticates the admin using a single pre-configured password and returns a short-lived JWT.
    /// </summary>
    [HttpPost("login")]
    public ActionResult<AdminLoginResponse> Login([FromBody] AdminLoginRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Password is required." });
        }

        var isValid = AdminAuthHelper.VerifyPassword(request.Password, _configuration);
        if (!isValid)
        {
            _logger.LogWarning("Failed admin login attempt from {IP}", HttpContext.Connection.RemoteIpAddress);
            return Unauthorized(new { message = "Invalid admin password." });
        }

        var (token, expiresIn, expiresAt) = AdminAuthHelper.GenerateJwtToken(_configuration);
        _logger.LogInformation("Admin authenticated successfully.");

        return Ok(new AdminLoginResponse
        {
            Token = token,
            ExpiresIn = expiresIn,
            ExpiresAt = expiresAt
        });
    }

    /// <summary>
    /// Retrieves all menu items (including unavailable items) for admin management.
    /// </summary>
    [Authorize]
    [HttpGet("menu-items")]
    public async Task<ActionResult<IEnumerable<AdminMenuItemDto>>> GetMenuItems()
    {
        var items = await _context.MenuItems
            .AsNoTracking()
            .Include(i => i.Category)
            .OrderBy(i => i.Category != null ? i.Category.DisplayOrder : 999)
            .ThenBy(i => i.DisplayOrder)
            .Select(i => new AdminMenuItemDto
            {
                Id = i.Id,
                CategoryId = i.CategoryId,
                CategoryName = i.Category != null ? i.Category.Name : "Uncategorized",
                Name = i.Name,
                Description = i.Description,
                Price = i.Price,
                PriceDisplay = i.PriceDisplay ?? (i.Price > 0 ? $"Rs. {i.Price:0.##}" : "Ask on WhatsApp"),
                ImageUrl = i.ImageUrl,
                IsAvailable = i.IsAvailable,
                DisplayOrder = i.DisplayOrder
            })
            .ToListAsync();

        return Ok(items);
    }

    /// <summary>
    /// Updates price and availability of a specific menu item.
    /// </summary>
    [Authorize]
    [HttpPut("menu-items/{id}")]
    public async Task<ActionResult<AdminMenuItemDto>> UpdateMenuItem(int id, [FromBody] UpdateMenuItemRequest request)
    {
        if (request == null)
        {
            return BadRequest(new { message = "Update data is required." });
        }

        var item = await _context.MenuItems
            .Include(i => i.Category)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (item == null)
        {
            return NotFound(new { message = $"Menu item with ID {id} not found." });
        }

        item.Price = request.Price;
        item.IsAvailable = request.IsAvailable;
        if (request.Price > 0)
        {
            item.PriceDisplay = $"Rs. {request.Price:0.##}";
        }
        else if (item.PriceDisplay != "Ask on WhatsApp")
        {
            item.PriceDisplay = "Ask on WhatsApp";
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation("Menu item {Id} ({Name}) updated: Price={Price}, Available={Available}", 
            item.Id, item.Name, item.Price, item.IsAvailable);

        return Ok(new AdminMenuItemDto
        {
            Id = item.Id,
            CategoryId = item.CategoryId,
            CategoryName = item.Category != null ? item.Category.Name : "Uncategorized",
            Name = item.Name,
            Description = item.Description,
            Price = item.Price,
            PriceDisplay = item.PriceDisplay,
            ImageUrl = item.ImageUrl,
            IsAvailable = item.IsAvailable,
            DisplayOrder = item.DisplayOrder
        });
    }
}
