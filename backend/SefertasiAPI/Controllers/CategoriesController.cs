using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SefertasiAPI.Models;
using SefertasiAPI.Models.DTOs;
using SefertasiAPI.Services;

namespace SefertasiAPI.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetAllCategories()
    {
        var categories = await _categoryService.GetActiveAsync();
        return Ok(categories);
    }

    [HttpGet("all")]
    [AllowAnonymous]
    public async Task<ActionResult<List<Category>>> GetAllCategoriesIncludingInactive()
    {
        var categories = await _categoryService.GetAllAsync();
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(string id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category == null)
        {
            return NotFound(new { message = $"Kategori bulunamadı. ID: {id}" });
        }

        return Ok(category);
    }

    [HttpGet("{id}/product-count")]
    public async Task<ActionResult<int>> GetProductCount(string id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category == null)
        {
            return NotFound(new { message = $"Kategori bulunamadı. ID: {id}" });
        }

        var count = await _categoryService.GetProductCountByCategoryAsync(category.Name);
        return Ok(new { categoryName = category.Name, productCount = count });
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<Category>> CreateCategory(CategoryDto categoryDto)
    {
        try
        {
            var category = new Category
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description,
                ImageUrl = categoryDto.ImageUrl,
                IsActive = categoryDto.IsActive,
                DisplayOrder = categoryDto.DisplayOrder
            };

            var createdCategory = await _categoryService.CreateAsync(category);
            return CreatedAtAction(nameof(GetCategory), new { id = createdCategory.Id }, createdCategory);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Kategori oluşturulurken bir hata oluştu.", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateCategory(string id, CategoryDto categoryDto)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category == null)
        {
            return NotFound(new { message = $"Kategori bulunamadı. ID: {id}" });
        }

        category.Name = categoryDto.Name;
        category.Description = categoryDto.Description;
        category.ImageUrl = categoryDto.ImageUrl;
        category.IsActive = categoryDto.IsActive;
        category.DisplayOrder = categoryDto.DisplayOrder;

        await _categoryService.UpdateAsync(id, category);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        try
        {
            var result = await _categoryService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new { message = $"Kategori bulunamadı. ID: {id}" });
            }

            return Ok(new { message = "Kategori başarıyla silindi." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Kategori silinirken bir hata oluştu.", error = ex.Message });
        }
    }

    [HttpPut("{id}/toggle-status")]
    [AllowAnonymous]
    public async Task<IActionResult> ToggleCategoryStatus(string id)
    {
        var result = await _categoryService.ToggleActiveStatusAsync(id);

        if (!result)
        {
            return NotFound(new { message = $"Kategori bulunamadı. ID: {id}" });
        }

        return Ok(new { message = "Kategori durumu güncellendi." });
    }
}
