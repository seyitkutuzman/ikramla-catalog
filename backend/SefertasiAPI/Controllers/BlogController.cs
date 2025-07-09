using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SefertasiAPI.Models;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace BlogMicroService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IMongoCollection<BlogPost> _posts;
        private readonly IWebHostEnvironment _env;
        public BlogController(IOptions<MongoDbSettings> settings, IWebHostEnvironment env)
        {
            _env = env;
            var client = new MongoClient(settings.Value.ConnectionString);
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _posts = db.GetCollection<BlogPost>(settings.Value.BlogsCollectionName);
        }

        // GET api/blog
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetAll() =>
            Ok(await _posts.Find(_ => true).ToListAsync());

        // GET api/blog/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPost>> Get(string id)
        {
            var post = await _posts.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (post == null) return NotFound();
            return Ok(post);
        }

        [HttpPost]
        public async Task<ActionResult<BlogPost>> Create(
            [FromForm] string Title,
            [FromForm] string Summary,
            [FromForm] string Content,
            [FromForm] string Category,
            [FromForm] IFormFile? ImageFile)
        {
            string? imageUrl = null;
            if (ImageFile != null)
            {
                var uploads = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "blog");
                Directory.CreateDirectory(uploads);
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(ImageFile.FileName)}";
                var filePath = Path.Combine(uploads, fileName);
                using var fs = System.IO.File.Create(filePath);
                await ImageFile.CopyToAsync(fs);
                imageUrl = $"/uploads/blog/{fileName}";
            }

            var post = new BlogPost
            {
                Title = Title,
                Summary = Summary,
                Content = Content,
                Category = Category,
                ImageUrl = imageUrl ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            await _posts.InsertOneAsync(post);
            return CreatedAtAction(nameof(Get), new { id = post.Id }, post);
        }

        // DELETE api/blog/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _posts.DeleteOneAsync(p => p.Id == id);
            if (result.DeletedCount == 0) return NotFound();
            return NoContent();
        }
    }
}
