using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SefertasiAPI.Models;
using Microsoft.Extensions.Options;

namespace SefertasiAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HeroController : ControllerBase
{
    private readonly IMongoCollection<HeroSlide> _slides;
    private readonly IWebHostEnvironment _env;

    public HeroController(IMongoClient client, IOptions<MongoDbSettings> dbSettings, IWebHostEnvironment env)
    {
        var database = client.GetDatabase(dbSettings.Value.DatabaseName);
        _slides = database.GetCollection<HeroSlide>("hero");
        _env = env;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<List<HeroSlide>> GetAll()
    {
        return await _slides.Find(_ => true).SortBy(s => s.Order).ToListAsync();
    }

    [HttpPost, Authorize(Roles = "Admin")]
    public async Task<ActionResult<HeroSlide>> Create([FromForm] IFormFile image,
                                                      [FromForm] string title,
                                                      [FromForm] string subtitle,
                                                      [FromForm] int order)
    {
        if (image == null || image.Length == 0)
            return BadRequest("Resim dosyası gerekli.");

        // uploads klasörünü ayarla
        var uploadsFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsFolder);

        // benzersiz dosya adı üret
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        // dosyayı kaydet
        using (var stream = System.IO.File.Create(filePath))
        {
            await image.CopyToAsync(stream);
        }

        // yeni slide objesi
        var slide = new HeroSlide
        {
            ImageUrl = $"/uploads/{fileName}",
            Title    = title,
            Subtitle = subtitle,
            Order    = order
        };

        await _slides.InsertOneAsync(slide);
        return CreatedAtAction(nameof(GetAll), new { id = slide.Id }, slide);
    }

    [HttpDelete("{id}"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _slides.DeleteOneAsync(s => s.Id == id);
        if (result.DeletedCount == 0) return NotFound();
        return NoContent();
    }
}
