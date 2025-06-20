using MongoDB.Driver;
using Microsoft.Extensions.Options;
using SefertasiAPI.Models;

namespace SefertasiAPI.Services;

public class CategoryService
{
    private readonly IMongoCollection<Category> _categoriesCollection;
    private readonly IMongoCollection<Product> _productsCollection;

    public CategoryService(IOptions<DatabaseSettings> databaseSettings)
    {
        var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
        _categoriesCollection = mongoDatabase.GetCollection<Category>("categories");
        _productsCollection = mongoDatabase.GetCollection<Product>(databaseSettings.Value.ProductsCollectionName);
    }

    public async Task<List<Category>> GetAllAsync() =>
        await _categoriesCollection.Find(_ => true)
            .SortBy(c => c.DisplayOrder)
            .ToListAsync();

    public async Task<List<Category>> GetActiveAsync() =>
        await _categoriesCollection.Find(c => c.IsActive)
            .SortBy(c => c.DisplayOrder)
            .ToListAsync();

    public async Task<Category?> GetByIdAsync(string id) =>
        await _categoriesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<Category?> GetByNameAsync(string name) =>
        await _categoriesCollection.Find(x => x.Name == name).FirstOrDefaultAsync();

    public async Task<Category> CreateAsync(Category newCategory)
    {
        // Aynı isimde kategori var mı kontrol et
        var existing = await GetByNameAsync(newCategory.Name);
        if (existing != null)
        {
            throw new InvalidOperationException("Bu isimde bir kategori zaten mevcut.");
        }

        // Otomatik sıralama numarası ata
        var lastCategory = await _categoriesCollection
            .Find(_ => true)
            .SortByDescending(c => c.DisplayOrder)
            .FirstOrDefaultAsync();

        newCategory.DisplayOrder = lastCategory?.DisplayOrder + 10 ?? 10;
        newCategory.CreatedAt = DateTime.UtcNow;
        newCategory.UpdatedAt = DateTime.UtcNow;

        await _categoriesCollection.InsertOneAsync(newCategory);
        return newCategory;
    }

    public async Task UpdateAsync(string id, Category updatedCategory)
    {
        updatedCategory.UpdatedAt = DateTime.UtcNow;
        await _categoriesCollection.ReplaceOneAsync(x => x.Id == id, updatedCategory);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var category = await GetByIdAsync(id);
        if (category == null)
            return false;

        // Bu kategoriye ait ürün var mı kontrol et
        var productCount = await _productsCollection.CountDocumentsAsync(p => p.Category == category.Name);
        if (productCount > 0)
        {
            throw new InvalidOperationException($"Bu kategoride {productCount} adet ürün bulunmaktadır. Önce ürünleri başka bir kategoriye taşıyın.");
        }

        var result = await _categoriesCollection.DeleteOneAsync(x => x.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<bool> ToggleActiveStatusAsync(string id)
    {
        var category = await GetByIdAsync(id);
        if (category == null)
            return false;

        category.IsActive = !category.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        await UpdateAsync(id, category);
        return true;
    }

    public async Task<int> GetProductCountByCategoryAsync(string categoryName)
    {
        return (int)await _productsCollection.CountDocumentsAsync(p => p.Category == categoryName);
    }
}