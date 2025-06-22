using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace SefertasiAPI.Models
{
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

        // Dökümandaki discountedPrice alanını da modele ekleyin
        [BsonElement("discountedPrice")]
        public decimal? DiscountedPrice { get; set; }

        // Dökümandaki discountPercentage alanı
        [BsonElement("discountPercentage")]
        public int? DiscountPercentage { get; set; }

        [BsonElement("category")]
        public string Category { get; set; } = string.Empty;

        [BsonElement("categoryId")]
        public string? CategoryId { get; set; }

        [BsonElement("imageUrl")]
        public string ImageUrl { get; set; } = string.Empty;

        [BsonElement("isActive")]
        public bool IsActive { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("tags")]
        public List<string> Tags { get; set; } = new List<string>();
    }
}
