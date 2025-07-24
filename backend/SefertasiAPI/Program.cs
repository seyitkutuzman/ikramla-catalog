using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using SefertasiAPI.Helpers;
using SefertasiAPI.Models;
using SefertasiAPI.Services;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "wwwroot",
});

// --- Kestrel HTTP & HTTPS Configuration ---
builder.WebHost.ConfigureKestrel(options =>
{
    // HTTP on port 80 (optional)
    options.Listen(IPAddress.Any, 80, listenOptions =>
        listenOptions.Protocols = HttpProtocols.Http1AndHttp2
    );

    // HTTPS on port 443
    options.Listen(IPAddress.Any, 443, listenOptions =>
    {
        listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
        listenOptions.UseHttps(httpsOptions =>
        {
            httpsOptions.ServerCertificateSelector = (context, host) =>
            {
                using var store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
                store.Open(OpenFlags.ReadOnly);
                var certs = store.Certificates.Find(
                    X509FindType.FindBySubjectName,
                    "sefertasi-backend.site",
                    validOnly: true);
                return certs.Count > 0 ? certs[0] : null;
            };
        });
    });
});

// 1) Settings binding
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

// 3) Application services
builder.Services.AddSingleton<AdminService>();
builder.Services.AddSingleton<CategoryService>();
builder.Services.AddSingleton<ProductService>();

// Register TokenService
builder.Services.AddScoped<TokenService>();

// 4) JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
        };
    });
builder.Services.AddAuthorization();

// 5) Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 6) CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("*");
    });
});

var app = builder.Build();

// 7) Seed initial data
using (var scope = app.Services.CreateScope())
{
    var adminService    = scope.ServiceProvider.GetRequiredService<AdminService>();
    var categoryService = scope.ServiceProvider.GetRequiredService<CategoryService>();
    var database        = scope.ServiceProvider.GetRequiredService<IMongoDatabase>();
    await new SeedDataHelper(adminService, categoryService, database)
        .SeedInitialData();
}

// 8) Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler(errApp =>
    {
        errApp.Run(async context =>
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync("{\"error\":\"An error occurred\"}");
        });
    });
}

app.UseStaticFiles();

// 9) Global CORS & response headers
// app.Use(async (context, next) =>
// {
//     context.Response.Headers["Access-Control-Allow-Origin"] = "*";
//     context.Response.Headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS,PATCH";
//     context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization";
//     context.Response.Headers["Access-Control-Expose-Headers"] = "*";
//     context.Response.Headers["Access-Control-Max-Age"] = "86400";

//     if (context.Request.Method == HttpMethods.Options)
//     {
//         context.Response.StatusCode = StatusCodes.Status200OK;
//         await context.Response.WriteAsync("OK");
//         return;
//     }

//     await next();
// });

app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
