using Microsoft.AspNetCore.Mvc;
using SefertasiAPI.Models.DTOs;
using SefertasiAPI.Services;

namespace SefertasiAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AdminService _adminService;
    private readonly TokenService _tokenService;

    public AuthController(AdminService adminService, TokenService tokenService)
    {
        _adminService = adminService;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
    {
        try
        {
            // Kullanıcı adı ve şifre kontrolü
            var isValid = await _adminService.ValidatePasswordAsync(loginDto.Username, loginDto.Password);
            if (!isValid)
            {
                return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı." });
            }

            // Admin bilgilerini al
            var admin = await _adminService.GetByUsernameAsync(loginDto.Username);
            if (admin == null)
            {
                return Unauthorized(new { message = "Kullanıcı bulunamadı." });
            }

            // Token oluştur
            var token = _tokenService.GenerateToken(admin);

            // Son giriş zamanını güncelle
            await _adminService.UpdateLastLoginAsync(loginDto.Username);

            return Ok(new LoginResponseDto
            {
                Token = token,
                Username = admin.Username,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60)
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Giriş işlemi sırasında bir hata oluştu.", error = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(CreateAdminDto createAdminDto)
    {
        try
        {
            var admin = await _adminService.CreateAdminAsync(createAdminDto);
            return Ok(new { message = "Admin kullanıcısı başarıyla oluşturuldu.", username = admin.Username });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Kayıt işlemi sırasında bir hata oluştu.", error = ex.Message });
        }
    }
}
