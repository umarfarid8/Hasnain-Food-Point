namespace HasnainFoodPoint.Api.DTOs;

public class AdminLoginRequest
{
    public string Password { get; set; } = string.Empty;
}

public class AdminLoginResponse
{
    public string Token { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
    public DateTime ExpiresAt { get; set; }
}

public class UpdateMenuItemRequest
{
    public decimal Price { get; set; }
    public bool IsAvailable { get; set; }
}

public class AdminMenuItemDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? PriceDisplay { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; }
    public int DisplayOrder { get; set; }
}
