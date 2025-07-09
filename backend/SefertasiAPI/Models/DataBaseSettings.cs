namespace SefertasiAPI.Models;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string ProductsCollectionName { get; set; } = string.Empty;
    public string BlogsCollectionName { get; set; } = string.Empty;
}
