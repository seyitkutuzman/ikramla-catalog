using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SefertasiAPI.Models;
using SefertasiAPI.Services;
using SefertasiAPI.Models.DTOs;

namespace SefertasiAPI.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _productService;
    private readonly IWebHostEnvironment _env;

    public ProductsController(ProductService productService, IWebHostEnvironment env)
    {
        _productService = productService;
        _env = env;
    }

    // ******************************************************
    // Anonim erişime açıldı:
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAllProducts()
    {
        var products = await _productService.GetActiveProductsAsync();
        return Ok(products);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(string id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null)
            return NotFound($"Ürün bulunamadı. ID: {id}");
        return Ok(product);
    }

    [AllowAnonymous]
    [HttpGet("category/{category}")]
    public async Task<ActionResult<List<Product>>> GetProductsByCategory(string category)
    {
        var products = await _productService.GetByCategoryAsync(category);
        return Ok(products);
    }

    [AllowAnonymous]
    [HttpGet("categories")]
    public async Task<ActionResult<List<string>>> GetCategories()
    {
        var categories = await _productService.GetCategoriesAsync();
        return Ok(categories);
    }

    [AllowAnonymous]
    [HttpGet("search/{searchTerm}")]
    public async Task<ActionResult<List<Product>>> SearchProducts(string searchTerm)
    {
        var products = await _productService.SearchAsync(searchTerm);
        return Ok(products);
    }
    // ******************************************************

    // Admin işlemleri için hâlâ token & rol kontrolü var:
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateProduct([FromForm] CreateProductDto dto)
    {
        var webRoot = Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploadsFolder = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadsFolder);

        string? fileName = null;
        if (dto.ImageFile != null)
        {
            fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);
            using var stream = System.IO.File.Create(filePath);
            await dto.ImageFile.CopyToAsync(stream);
        }

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            DiscountedPrice = dto.DiscountedPrice,
            DiscountPercentage = dto.DiscountPercentage,
            Category = dto.Category,
            ImageUrl = fileName is null ? null! : $"/uploads/{fileName}",
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            Tags = dto.Tags?.ToList() ?? new List<string>()
        };

        await _productService.CreateAsync(product);
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateProduct(string id, [FromForm] CreateProductDto dto)
    {
        var existing = await _productService.GetByIdAsync(id);
        if (existing == null) return NotFound($"Ürün bulunamadı. ID: {id}");

        // uploads klasörünün yolu:
        var webRoot = Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploadsFolder = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadsFolder);

        // Resim yüklendiyse kaydet
        if (dto.ImageFile != null)
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);
            using var stream = System.IO.File.Create(filePath);
            await dto.ImageFile.CopyToAsync(stream);
            existing.ImageUrl = $"/uploads/{fileName}";
        }

        // Diğer alanları güncelle
        existing.Name = dto.Name;
        existing.Description = dto.Description;
        existing.Price = dto.Price;
        existing.DiscountedPrice = dto.DiscountedPrice;
        existing.DiscountPercentage = dto.DiscountPercentage;
        existing.Category = dto.Category;
        existing.IsActive = dto.IsActive;
        existing.Tags = dto.Tags?.ToList() ?? new List<string>();

        await _productService.UpdateAsync(id, existing);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null)
            return NotFound($"Ürün bulunamadı. ID: {id}");

        await _productService.RemoveAsync(id);
        return NoContent();
    }
}
