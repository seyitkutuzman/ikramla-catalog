// Models/HeroSlide.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SefertasiAPI.Models
{
    public class HeroSlide
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
