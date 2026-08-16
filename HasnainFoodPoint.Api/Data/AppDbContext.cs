using Microsoft.EntityFrameworkCore;
using HasnainFoodPoint.Api.Models;

namespace HasnainFoodPoint.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();
    public DbSet<BusinessInfo> BusinessInfos => Set<BusinessInfo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Description).HasMaxLength(250);

            entity.HasMany(c => c.Items)
                  .WithOne(i => i.Category)
                  .HasForeignKey(i => i.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // MenuItem configuration
        modelBuilder.Entity<MenuItem>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.Name).IsRequired().HasMaxLength(150);
            entity.Property(m => m.Description).HasMaxLength(300);
            entity.Property(m => m.Price).HasPrecision(18, 2);
            entity.Property(m => m.PriceDisplay).HasMaxLength(50);
            entity.Property(m => m.ImageUrl).HasMaxLength(500);
        });

        // BusinessInfo configuration
        modelBuilder.Entity<BusinessInfo>(entity =>
        {
            entity.HasKey(b => b.Id);
            entity.Property(b => b.Name).IsRequired().HasMaxLength(150);
            entity.Property(b => b.Tagline).HasMaxLength(250);
            entity.Property(b => b.WhatsAppNumber).IsRequired().HasMaxLength(50);
            entity.Property(b => b.WhatsAppRawNumber).IsRequired().HasMaxLength(50);
            entity.Property(b => b.Address).IsRequired().HasMaxLength(250);
            entity.Property(b => b.OpeningHours).IsRequired().HasMaxLength(100);
            entity.Property(b => b.MapUrl).HasMaxLength(500);
            entity.Property(b => b.OwnerName).HasMaxLength(100);
            entity.Property(b => b.OwnerStory).HasMaxLength(1000);
            entity.Property(b => b.OwnerPhotoUrl).HasMaxLength(500);
        });
    }
}
