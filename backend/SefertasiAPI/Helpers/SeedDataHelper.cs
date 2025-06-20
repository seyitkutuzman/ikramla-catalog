using MongoDB.Driver;
using SefertasiAPI.Models;
using SefertasiAPI.Models.DTOs;
using SefertasiAPI.Services;

namespace SefertasiAPI.Helpers;

public class SeedDataHelper
{
    private readonly AdminService _adminService;
    private readonly CategoryService _categoryService;
    private readonly IMongoDatabase _database;

    public SeedDataHelper(AdminService adminService, CategoryService categoryService, IMongoDatabase database)
    {
        _adminService = adminService;
        _categoryService = categoryService;
        _database = database;
    }

    public async Task SeedInitialData()
    {
        // İlk admin kullanıcısını oluştur
        await CreateInitialAdmin();
        
        // Kategorileri oluştur
        await CreateInitialCategories();
    }

    private async Task CreateInitialAdmin()
    {
        var existingAdmin = await _adminService.GetByUsernameAsync("admin");
        if (existingAdmin == null)
        {
            var createAdminDto = new CreateAdminDto
            {
                Username = "admin",
                Password = "Admin123!",
                Email = "admin@sefertasi.com"
            };

            await _adminService.CreateAdminAsync(createAdminDto);
            Console.WriteLine("İlk admin kullanıcısı oluşturuldu. Username: admin, Password: Admin123!");
        }
    }

    private async Task CreateInitialCategories()
    {
        var categories = new List<Category>
        {
            new Category
            {
                Name = "Kahvaltılık",
                Description = "Taze ve lezzetli kahvaltılık ürünler",
                DisplayOrder = 10,
                IsActive = true
            },
            new Category
            {
                Name = "Süt Ürünleri",
                Description = "Taze süt ve süt ürünleri",
                DisplayOrder = 20,
                IsActive = true
            },
            new Category
            {
                Name = "Et ve Tavuk",
                Description = "Taze et ve tavuk ürünleri",
                DisplayOrder = 30,
                IsActive = true
            },
            new Category
            {
                Name = "Meyve ve Sebze",
                Description = "Taze meyve ve sebzeler",
                DisplayOrder = 40,
                IsActive = true
            },
            new Category
            {
                Name = "Baklagil ve Tahıl",
                Description = "Baklagiller ve tahıl ürünleri",
                DisplayOrder = 50,
                IsActive = true
            },
            new Category
            {
                Name = "Atıştırmalık",
                Description = "Kuruyemiş ve atıştırmalıklar",
                DisplayOrder = 60,
                IsActive = true
            },
            new Category
            {
                Name = "İçecek",
                Description = "Soğuk ve sıcak içecekler",
                DisplayOrder = 70,
                IsActive = true
            },
            new Category
            {
                Name = "Temizlik",
                Description = "Ev temizlik ürünleri",
                DisplayOrder = 80,
                IsActive = true
            }
        };

        foreach (var category in categories)
        {
            var existing = await _categoryService.GetByNameAsync(category.Name);
            if (existing == null)
            {
                await _categoryService.CreateAsync(category);
                Console.WriteLine($"Kategori oluşturuldu: {category.Name}");
            }
        }
    }
}

// Program.cs'e eklenecek kod (SeedData için)
// Bu kodu var app = builder.Build(); satırından sonra ekleyin:

// Seed initial data

