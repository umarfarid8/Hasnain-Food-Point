namespace HasnainFoodPoint.Api.DTOs;

public class SettingsDto
{
    public string Name { get; set; } = string.Empty;
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
