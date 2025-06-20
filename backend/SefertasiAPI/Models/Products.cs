using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SefertasiAPI.Models;

public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("price")]
    public decimal Price { get; set; }

    [BsonElement("discountedPrice")]
    public decimal? DiscountedPrice { get; set; }

    [BsonElement("category")]
    public string Category { get; set; } = string.Empty;

    [BsonElement("categoryId")]
    public string? CategoryId { get; set; }

    [BsonElement("imageUrl")]
    public string ImageUrl { get; set; } = string.Empty;

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("tags")]
    public List<string> Tags { get; set; } = new();

    // Hesaplanmış özellik - indirim yüzdesi
    public int? DiscountPercentage 
    {
        get
        {
            if (DiscountedPrice.HasValue && DiscountedPrice.Value > 0)
            {
                return (int)Math.Round((1 - (DiscountedPrice.Value / Price)) * 100);
            }
            return null;
        }
    }
}