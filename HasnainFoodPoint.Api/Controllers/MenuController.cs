using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HasnainFoodPoint.Api.Data;
using HasnainFoodPoint.Api.DTOs;

namespace HasnainFoodPoint.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly AppDbContext _context;

    public MenuController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all active categories and their available menu items.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetMenu()
    {
        var categories = await _context.Categories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                DisplayOrder = c.DisplayOrder,
                Items = c.Items
                    .Where(i => i.IsAvailable)
                    .OrderBy(i => i.DisplayOrder)
                    .Select(i => new MenuItemDto
                    {
                        Id = i.Id,
                        CategoryId = i.CategoryId,
                        Name = i.Name,
                        Description = i.Description,
                        Price = i.Price,
                        PriceDisplay = i.PriceDisplay ?? (i.Price > 0 ? $"Rs. {i.Price:0.##}" : "Ask on WhatsApp"),
                        ImageUrl = i.ImageUrl,
                        IsAvailable = i.IsAvailable,
                        DisplayOrder = i.DisplayOrder
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(categories);
    }

    /// <summary>
    /// Retrieves all available menu items as a flat list.
    /// </summary>
    [HttpGet("items")]
    public async Task<ActionResult<IEnumerable<MenuItemDto>>> GetAllItems()
    {
        var items = await _context.MenuItems
            .AsNoTracking()
            .Where(i => i.IsAvailable && i.Category != null && i.Category.IsActive)
            .OrderBy(i => i.Category!.DisplayOrder)
            .ThenBy(i => i.DisplayOrder)
            .Select(i => new MenuItemDto
            {
                Id = i.Id,
                CategoryId = i.CategoryId,
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
}
