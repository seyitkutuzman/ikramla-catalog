using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using SefertasiAPI.Helpers;
using SefertasiAPI.Models;
using SefertasiAPI.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "wwwroot",
    ContentRootPath = AppContext.BaseDirectory
});

// 1) Sadece bir kez bind edin
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("DatabaseSettings"));

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

// 2) MongoDB
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});
builder.Services.AddScoped(sp =>
    sp.GetRequiredService<IMongoClient>()
      .GetDatabase(sp.GetRequiredService<IOptions<MongoDbSettings>>().Value.DatabaseName)
);

// 3) Servisler
builder.Services.AddSingleton<AdminService>();
builder.Services.AddSingleton<AdminService>();
builder.Services.AddSingleton<CategoryService>();
builder.Services.AddSingleton<ProductService>();

// 4) JWT
var jwt = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                                          Encoding.UTF8.GetBytes(jwt.SecretKey))
        };
    });
builder.Services.AddAuthorization();

// 5) MVC & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => { /* ... */ });

// 6) CORS - TÜM İSTEKLERE İZİN VER
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()      // Herhangi bir origin'den
                  .AllowAnyMethod()      // Herhangi bir HTTP metodu (GET, POST, PUT, DELETE, OPTIONS vs.)
                  .AllowAnyHeader()      // Herhangi bir header
                  .WithExposedHeaders("*"); // Tüm header'ları expose et
        });
});

var app = builder.Build();

// 7) Seed
using (var scope = app.Services.CreateScope())
{
    var admin = scope.ServiceProvider.GetRequiredService<AdminService>();
    var cat = scope.ServiceProvider.GetRequiredService<CategoryService>();
    var db = scope.ServiceProvider.GetRequiredService<IMongoDatabase>();
    await new SeedDataHelper(admin, cat, db).SeedInitialData();
}

// 8) Pipeline

// İLK OLARAK - OPTIONS istekleri için özel middleware (EN ÖNEMLİ KISIM!)
app.Use(async (context, next) =>
{
    // Tüm response'lara CORS header'ları ekle
    context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    context.Response.Headers.Add("Access-Control-Allow-Headers", "*");
    context.Response.Headers.Add("Access-Control-Max-Age", "86400");
    
    // OPTIONS (preflight) isteklerini hemen yanıtla
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        await context.Response.WriteAsync("OK");
        return;
    }
    
    // Diğer istekler için devam et
    await next.Invoke();
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

// HTTPS yönlendirmeyi kapat - HTTP isteklere de izin ver
// app.UseHttpsRedirection();

// Middleware sıralaması
app.UseRouting();

// CORS politikasını kullan (özel middleware'den sonra da olabilir)
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

// Controller'ları map et
app.MapControllers();

// Catch-all endpoint - 404 durumlarında da CORS header'ları olsun
app.MapFallback(async context =>
{
    context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
    context.Response.StatusCode = 404;
    await context.Response.WriteAsync("Endpoint not found");
});

// Exception handling middleware - hatalarda da CORS header'ları olsun
app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"error\":\"An error occurred\"}");
    });
});

app.Run();