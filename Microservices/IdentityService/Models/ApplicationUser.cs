namespace IdentityService.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser<int>
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? ZipCode { get; set; }
        public string? UserTheme { get; set; }
        public string? ProfileImage { get; set; }

        //public string? ConfirmEmailCode { get; set; }
        //public string? ResetPasswordCode { get; set; }
        public bool IsActive { get; set; } = true;
    }
}