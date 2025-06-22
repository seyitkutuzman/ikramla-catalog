// Models/DTOs/CreateProductDto.cs
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SefertasiAPI.Models.DTOs
{
// Models/DTOs/CreateProductDto.cs
public class CreateProductDto
{
    [Required] public string Name { get; set; } = string.Empty;
    [Required] public string Description { get; set; } = string.Empty;
    [Required] public decimal Price { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public int? DiscountPercentage { get; set; }
    [Required] public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public IFormFile? ImageFile { get; set; }
    public string[]? Tags { get; set; }
}

    public class UpdateProductDto : CreateProductDto
    {
        [Required] public string Id { get; set; } = string.Empty;
    }
}
