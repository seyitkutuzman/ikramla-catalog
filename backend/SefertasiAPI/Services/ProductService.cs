using MongoDB.Driver;
using Microsoft.Extensions.Options;
using SefertasiAPI.Models;

namespace SefertasiAPI.Services;

public class ProductService
{
    private readonly IMongoCollection<Product> _productsCollection;

    public ProductService(IOptions<MongoDbSettings> databaseSettings)
    {
        var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
        _productsCollection = mongoDatabase.GetCollection<Product>(databaseSettings.Value.ProductsCollectionName);
    }

    public async Task<List<Product>> GetAllAsync() =>
        await _productsCollection.Find(_ => true).ToListAsync();

    public async Task<Product?> GetByIdAsync(string id) =>
        await _productsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<List<Product>> GetByCategoryAsync(string category) =>
        await _productsCollection.Find(x => x.Category == category).ToListAsync();

    public async Task<List<Product>> GetActiveProductsAsync() =>
        await _productsCollection.Find(x => x.IsActive == true).ToListAsync();

    public async Task CreateAsync(Product newProduct) =>
        await _productsCollection.InsertOneAsync(newProduct);

    public async Task UpdateAsync(string id, Product updatedProduct) =>
        await _productsCollection.ReplaceOneAsync(x => x.Id == id, updatedProduct);

    public async Task RemoveAsync(string id) =>
        await _productsCollection.DeleteOneAsync(x => x.Id == id);

    // Kategorileri getir
    public async Task<List<string>> GetCategoriesAsync()
    {
        return await _productsCollection
            .Distinct<string>("category", Builders<Product>.Filter.Empty)
            .ToListAsync();
    }

    // Arama fonksiyonu
    public async Task<List<Product>> SearchAsync(string searchTerm)
    {
        var filter = Builders<Product>.Filter.Or(
            Builders<Product>.Filter.Regex(x => x.Name, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            Builders<Product>.Filter.Regex(x => x.Description, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
        );
        
        return await _productsCollection.Find(filter).ToListAsync();
    }
}