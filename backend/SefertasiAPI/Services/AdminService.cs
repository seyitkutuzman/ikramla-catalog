using MongoDB.Driver;
using Microsoft.Extensions.Options;
using SefertasiAPI.Models;
using SefertasiAPI.Models.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace SefertasiAPI.Services;

public class AdminService
{
    private readonly IMongoCollection<Admin> _adminsCollection;

    public AdminService(IOptions<DatabaseSettings> databaseSettings)
    {
        var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
        _adminsCollection = mongoDatabase.GetCollection<Admin>("admins");
    }

    public async Task<Admin?> GetByUsernameAsync(string username) =>
        await _adminsCollection.Find(x => x.Username == username).FirstOrDefaultAsync();

    public async Task<Admin?> GetByIdAsync(string id) =>
        await _adminsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<Admin> CreateAdminAsync(CreateAdminDto createAdminDto)
    {
        var existingAdmin = await GetByUsernameAsync(createAdminDto.Username);
        if (existingAdmin != null)
        {
            throw new InvalidOperationException("Bu kullanıcı adı zaten kullanılıyor.");
        }

        var admin = new Admin
        {
            Username = createAdminDto.Username,
            Email = createAdminDto.Email,
            PasswordHash = HashPassword(createAdminDto.Password)
        };

        await _adminsCollection.InsertOneAsync(admin);
        return admin;
    }

    public async Task<bool> ValidatePasswordAsync(string username, string password)
    {
        var admin = await GetByUsernameAsync(username);
        if (admin == null || !admin.IsActive)
            return false;

        return VerifyPassword(password, admin.PasswordHash);
    }

    public async Task UpdateLastLoginAsync(string username)
    {
        var filter = Builders<Admin>.Filter.Eq(x => x.Username, username);
        var update = Builders<Admin>.Update.Set(x => x.LastLoginAt, DateTime.UtcNow);
        await _adminsCollection.UpdateOneAsync(filter, update);
    }

    private string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "SefertasiSalt"));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    private bool VerifyPassword(string password, string passwordHash)
    {
        string hashedInput = HashPassword(password);
        return hashedInput == passwordHash;
    }
}
