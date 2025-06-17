using Microsoft.AspNetCore.Mvc;
using SefertasiAPI.Models;
using SefertasiAPI.Services;

namespace SefertasiAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductsController(ProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAllProducts()
    {
        var products = await _productService.GetActiveProductsAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(string id)
    {
        var product = await _productService.GetByIdAsync(id);
        
        if (product == null)
        {
            return NotFound($"Ürün bulunamadı. ID: {id}");
        }

        return Ok(product);
    }

    [HttpGet("category/{category}")]
    public async Task<ActionResult<List<Product>>> GetProductsByCategory(string category)
    {
        var products = await _productService.GetByCategoryAsync(category);
        return Ok(products);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<string>>> GetCategories()
    {
        var categories = await _productService.GetCategoriesAsync();
        return Ok(categories);
    }

    [HttpGet("search/{searchTerm}")]
    public async Task<ActionResult<List<Product>>> SearchProducts(string searchTerm)
    {
        var products = await _productService.SearchAsync(searchTerm);
        return Ok(products);
    }

    // Admin işlemleri için
    [HttpPost]
    public async Task<IActionResult> CreateProduct(Product newProduct)
    {
        await _productService.CreateAsync(newProduct);
        return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(string id, Product updatedProduct)
    {
        var product = await _productService.GetByIdAsync(id);

        if (product == null)
        {
            return NotFound($"Ürün bulunamadı. ID: {id}");
        }

        updatedProduct.Id = product.Id;
        await _productService.UpdateAsync(id, updatedProduct);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var product = await _productService.GetByIdAsync(id);

        if (product == null)
        {
            return NotFound($"Ürün bulunamadı. ID: {id}");
        }

        await _productService.RemoveAsync(id);

        return NoContent();
    }
}