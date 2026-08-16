namespace HasnainFoodPoint.Api.Models;

public class BusinessInfo
{
    public int Id { get; set; }
    public string Name { get; set; } = "Hasnain Food Point";
    public string Tagline { get; set; } = string.Empty;
    public string WhatsAppNumber { get; set; } = string.Empty;
    public string WhatsAppRawNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string OpeningHours { get; set; } = string.Empty;
    public string? MapUrl { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    public string OwnerStory { get; set; } = string.Empty;
    public string? OwnerPhotoUrl { get; set; }
}
