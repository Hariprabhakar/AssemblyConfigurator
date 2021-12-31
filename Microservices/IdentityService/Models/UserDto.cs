using System.ComponentModel.DataAnnotations;

namespace IdentityService.Models
{
    public record struct RegisterUserDto(string UserName, string Email, string Password);
    public record struct SendInviteDto(int UserId, string BaseUrl);
    public record struct ConfirmEmailDto(int UserId, string Token);
    public record struct ForgotPasswordDto(string Email);

    public record struct ResetPasswordDto
    {
        [Required]
        public int UserId { get; set; }

        public string Token { get; set; } = string.Empty;

        [Required]
        [StringLength(15, MinimumLength = 5, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
        public string Password { get; set; } = string.Empty;
    }

    public record struct ChangePasswordDto
    {
        public int UserId { get; set; }

        //public string OldPassword { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public record struct CreateUserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? ZipCode { get; set; }
        public string? UserTheme { get; set; }
        public string? ProfileImage { get; set; }
    }

    public record struct UpdateUserDto
    {
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? ZipCode { get; set; }
        public string? UserTheme { get; set; }
        public string? ProfileImage { get; set; }
    }

    public record struct ActivateDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "{0} should be between {1} and {2}")]
        public int UserId { get; set; }

        [Required]
        public bool Active { get; set; }
    }

    public enum RoleEnum
    {
        SuperAdmin = 1,
        CompanyAdmin,
        StandardUser
    }
}