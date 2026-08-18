using Microsoft.EntityFrameworkCore;
using HasnainFoodPoint.Api.Models;

namespace HasnainFoodPoint.Api.Data;

public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        // Apply any pending migrations
        if (context.Database.IsRelational())
        {
            await context.Database.MigrateAsync();
        }

        // Seed BusinessInfo if not present
        if (!await context.BusinessInfos.AnyAsync())
        {
            var businessInfo = new BusinessInfo
            {
                Name = "Hasnain Food Point",
                Tagline = "Fresh, Crispy & Honest Fast Food in Sahiwal",
                WhatsAppNumber = "0305 1589494",
                WhatsAppRawNumber = "923051589494",
                Address = "94/9-L, Sahiwal",
                OpeningHours = "12:00 PM – 9:00 PM, daily",
                MapUrl = "https://maps.app.goo.gl/pbYxzzyQbwvbU8897",
                OwnerName = "Hasnain Zafar",
                OwnerStory = "Hasnain Zafar started Hasnain Food Point right here in Sahiwal with one simple idea — serve fresh, honest food, made the way he'd want to eat it himself. What began as a small food point has become a daily stop for fries, rolls, and burgers made fresh to order. Every plate carries his name, so every plate gets his full attention.",
                OwnerPhotoUrl = "/assets/images/owner.webp"
            };

            await context.BusinessInfos.AddAsync(businessInfo);
        }

        // Seed Categories and MenuItems if not present
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new Category
                {
                    Name = "Fries",
                    Description = "Crispy & Fresh • گرما گرم فرائز",
                    DisplayOrder = 1,
                    IsActive = true,
                    Items = new List<MenuItem>
                    {
                        new MenuItem
                        {
                            Name = "Half Plate Fries",
                            Description = "Crispy seasoned potato fries • ہاف پلیٹ",
                            Price = 50.00m,
                            PriceDisplay = "Rs. 50",
                            ImageUrl = "/assets/images/fries-half.webp",
                            DisplayOrder = 1,
                            IsAvailable = true
                        },
                        new MenuItem
                        {
                            Name = "Full Plate Fries",
                            Description = "Generous serving of hot crispy fries • فل پلیٹ",
                            Price = 100.00m,
                            PriceDisplay = "Rs. 100",
                            ImageUrl = "/assets/images/fries-full.webp",
                            DisplayOrder = 2,
                            IsAvailable = true
                        }
                    }
                },
                new Category
                {
                    Name = "Burger",
                    Description = "Fresh & Juicy • تازہ انڈہ برگر",
                    DisplayOrder = 2,
                    IsActive = true,
                    Items = new List<MenuItem>
                    {
                        new MenuItem
                        {
                            Name = "Amelet Burger",
                            Description = "Spiced egg patty in toasted bun • سپیشل انڈہ برگر",
                            Price = 150.00m,
                            PriceDisplay = "Rs. 150",
                            ImageUrl = "/assets/images/amelet-burger.webp",
                            DisplayOrder = 1,
                            IsAvailable = true
                        }
                    }
                },
                new Category
                {
                    Name = "Samosa",
                    Description = "Crispy Golden • کرسپی سموسہ",
                    DisplayOrder = 3,
                    IsActive = true,
                    Items = new List<MenuItem>
                    {
                        new MenuItem
                        {
                            Name = "Aloo Samosa",
                            Description = "Crispy pastry with spicy potato filling • گرما گرم سموسہ",
                            Price = 30.00m,
                            PriceDisplay = "Rs. 30",
                            ImageUrl = "/assets/images/aloo-samosa.webp",
                            DisplayOrder = 1,
                            IsAvailable = true
                        }
                    }
                },
                new Category
                {
                    Name = "Roll",
                    Description = "Crunchy Snack • ذائقہ دار رول",
                    DisplayOrder = 4,
                    IsActive = true,
                    Items = new List<MenuItem>
                    {
                        new MenuItem
                        {
                            Name = "Aloo Roll",
                            Description = "Golden fried roll with spiced potatoes • کرسپی آلو رول",
                            Price = 10.00m,
                            PriceDisplay = "Rs. 10",
                            ImageUrl = "/assets/images/aloo-roll.webp",
                            DisplayOrder = 1,
                            IsAvailable = true
                        }
                    }
                },
                new Category
                {
                    Name = "Naan",
                    Description = "Soft & Stuffed • تندوری آلو نان",
                    DisplayOrder = 5,
                    IsActive = true,
                    Items = new List<MenuItem>
                    {
                        new MenuItem
                        {
                            Name = "Aloo Naan",
                            Description = "Warm tandoori naan with spiced potatoes • تازہ تندوری نان",
                            Price = 70.00m,
                            PriceDisplay = "Rs. 70",
                            ImageUrl = "/assets/images/aloo-naan.webp",
                            DisplayOrder = 1,
                            IsAvailable = true
                        }
                    }
                },
                new Category
                {
                    Name = "Cold Drinks & Juices",
                    Description = "Chilled Refreshments • ٹھنڈی بوتلیں",
                    DisplayOrder = 6,
                    IsActive = true,
                    Items = new List<MenuItem>
                    {
                        new MenuItem
                        {
                            Name = "Gourmet, Coke, Pepsi",
                            Description = "Chilled drinks & juices • حسبِ پسند بوتل",
                            Price = 0.00m,
                            PriceDisplay = "Ask on WhatsApp",
                            ImageUrl = "/assets/images/cold-drinks.webp",
                            DisplayOrder = 1,
                            IsAvailable = true
                        }
                    }
                }
            };

            await context.Categories.AddRangeAsync(categories);
        }

        await context.SaveChangesAsync();
    }
}
