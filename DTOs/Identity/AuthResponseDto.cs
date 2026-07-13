namespace CompetitionsTest.DTOs.Identity
{
    public class AuthResponseDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
