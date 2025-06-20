// Models/DTOs/LoginResponseDto.cs
namespace SefertasiAPI.Models.DTOs;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

