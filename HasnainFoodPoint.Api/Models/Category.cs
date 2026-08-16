namespace HasnainFoodPoint.Api.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation property
    public ICollection<MenuItem> Items { get; set; } = new List<MenuItem>();
}
