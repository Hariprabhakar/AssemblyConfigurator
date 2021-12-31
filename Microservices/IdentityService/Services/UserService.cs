using IdentityService.Helpers;

namespace IdentityService.Services
{
    public interface IUserService
    {
        #region Self service methods

        Task<ApplicationUser> Register(RegisterUserDto model, string baseUrl,
            RoleEnum role = RoleEnum.StandardUser);

        Task<bool> SendInvite(SendInviteDto model, string? password = null);

        Task<IdentityResult> ConfirmEmail(ConfirmEmailDto model);

        Task<bool> ForgotPassword(ForgotPasswordDto model, string baseUrl);

        Task<IdentityResult> ResetPassword(ResetPasswordDto model);

        Task<IdentityResult> ChangePassword(ChangePasswordDto model);

        Task<IdentityResult> Update(int id, UpdateUserDto model);

        Task<ApplicationUser> GetById(int id);

        Task<ApplicationUser> GetByEmail(string email);

        #endregion Self service methods

        #region Administrative methods

        Task<ApplicationUser> Create(CreateUserDto model, string baseUrl,
            RoleEnum role = RoleEnum.StandardUser);

        Task<IdentityResult> Activate(int id, ActivateDto model);

        #endregion Administrative methods
    }

    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;

        public UserService(UserManager<ApplicationUser> userManager, IEmailService emailService)
        {
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task<ApplicationUser> Register(RegisterUserDto model,
            string baseUrl, RoleEnum role = RoleEnum.StandardUser)
        {
            var user = new ApplicationUser()
            {
                UserName = model.UserName.Trim(),
                Email = model.Email.Trim().ToLower(),
                NormalizedUserName = model.UserName.Trim().ToUpper(),
                NormalizedEmail = model.Email.Trim().ToUpper()
            };

            #region Check duplicate of username, email and phone

            var (existsUserName, errorUserName) = await ExistsUserName(user.NormalizedUserName);
            var (existsEmail, errorEmail) = await ExistsEmail(user.NormalizedEmail);
            var (existsPhone, errorPhone) = await ExistsPhone(user.PhoneNumber);

            if (existsUserName || existsEmail || existsPhone)
            {
                var e = new DuplicateException("UserName/Email/phone already exists.");
                if (existsUserName)
                {
                    e.Data.Add("UserName", errorUserName);
                }
                if (existsEmail)
                {
                    e.Data.Add("Email", errorEmail);
                }

                if (existsPhone)
                {
                    e.Data.Add("Phone", errorPhone);
                }

                throw e;
            }

            #endregion Check duplicate of username, email and phone

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                result = await _userManager.AddToRoleAsync(user, role.ToString());
                if (result.Succeeded)
                {
                    await SendInvite(new SendInviteDto { UserId = user.Id, BaseUrl = baseUrl });
                }
            }
            return user;
        }

        public async Task<IdentityResult> Update(int id, UpdateUserDto model)
        {
            if (id != model.UserId)
            {
                throw new BadRequestException("User Id does not match.");
            }
            var user = await _userManager.FindByIdAsync(model.UserId.ToString());
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Street = model.Street;
            user.City = model.City;
            user.State = model.State;
            user.ZipCode = model.ZipCode;
            user.UserTheme = model.UserTheme;
            user.ProfileImage = model.ProfileImage;
            return await _userManager.UpdateAsync(user);
        }

        public async Task<ApplicationUser> GetById(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }
            return user;
        }

        public async Task<ApplicationUser> GetByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }
            return user;
        }

        public async Task<bool> SendInvite(SendInviteDto model, string? password = null)
        {
            var user = await _userManager.FindByIdAsync(model.UserId.ToString());
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            string loginUrl = $"{model.BaseUrl}/confirm-email?userId={model.UserId}&token={token}";
            string body = $@"
                <p>Hey <strong>{user.FirstName} {user.LastName}</strong>,</p>
                <p>Welcome to Sanveo! You are almost done.</p>
                <p>
                UserName: {user.UserName}<br>
                {(string.IsNullOrEmpty(password) ? string.Empty : $"Password: {password}")}<br>
                </p>
                <p>Click <a href='{loginUrl}'>here</a> to confirm your email address and start using Sanveo app.</p>
                <p>Alternately, copy and paste the URL below directly into your browser:<br>
                <a href='{loginUrl}'>{loginUrl}</a></p>
                <p>Sanveo</p>
                <p>Note: This is a system alert message. Please do not reply to this email.</p>
                ";
            await _emailService.SendEmailAsync(new MailRequest
            {
                ToEmail = user.Email,
                Subject = "Confirm your account",
                Body = body
            });
            return true;
        }

        public async Task<IdentityResult> ConfirmEmail(ConfirmEmailDto model)
        {
            if (model.UserId == 0 || string.IsNullOrEmpty(model.Token))
            {
                throw new BadRequestException("Invalid User ID and/or Confirmation token.");
            }
            var user = await _userManager.FindByIdAsync(model.UserId.ToString());
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            return await _userManager.ConfirmEmailAsync(user, model.Token);
        }

        public async Task<bool> ForgotPassword(ForgotPasswordDto model, string baseUrl)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                // Don't reveal that the user does not exist or is not confirmed
                throw new BadRequestException($"Invalid input.");
            }
            if (user.LockoutEnabled)
            {
                throw new BadRequestException("Your account is locked out.");
            }

            string token = await _userManager.GeneratePasswordResetTokenAsync(user);
            string resetPasswordUrl = $"{baseUrl}/reset-password?userId={user.Id}&token={token}";
            string body = $@"
                Hey <strong>{user.FirstName} {user.LastName}</strong>,<br>
                <br>
                Greetings from Sanveo!<br>
                <br>
                You have requested to reset your password.<br>
                Click <a href='{resetPasswordUrl}'>here</a> to change the password.<br>
                <br>
                Alternately you can use below URL directly in browser.<br>
                <a href='{resetPasswordUrl}'>{resetPasswordUrl}</a><br>
                <br>
                Thanks,<br>
                Sanveo<br>
                <br>
                Note: This is a system alert message. Please do not reply to this email.<br>
                ";
            await _emailService.SendEmailAsync(new MailRequest
            {
                ToEmail = model.Email,
                Subject = "Reset password",
                Body = body
            });
            return true;
        }

        public async Task<IdentityResult> ResetPassword(ResetPasswordDto model)
        {
            if (model.UserId == 0)
            {
                throw new BadRequestException("Invalid User ID and/or Reset password token.");
            }
            var user = await _userManager.FindByIdAsync(model.UserId.ToString());
            if (user == null)
            {
                throw new BadRequestException("Email address and Reset token does not match.");
            }

            return await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
        }

        public async Task<IdentityResult> ChangePassword(ChangePasswordDto model)
        {
            if (model.UserId == 0)
            {
                throw new BadRequestException("Invalid User ID.");
            }
            var user = await _userManager.FindByIdAsync(model.UserId.ToString());
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }
            string token = await _userManager.GeneratePasswordResetTokenAsync(user);
            return await _userManager.ResetPasswordAsync(user, token, model.Password);
        }

        public async Task<IdentityResult> Activate(int id, ActivateDto model)
        {
            if (id != model.UserId)
            {
                throw new BadRequestException("User Id does not match.");
            }

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            else
            {
                user.IsActive = model.Active;
                return await _userManager.UpdateAsync(user);
            }
        }

        public async Task<ApplicationUser> Create(CreateUserDto model,
            string baseUrl, RoleEnum role = RoleEnum.StandardUser)
        {
            var user = new ApplicationUser
            {
                UserName = model.UserName.Trim(),
                NormalizedUserName = model.UserName.Trim().ToUpper(),
                Email = model.Email.Trim().ToLower(),
                NormalizedEmail = model.Email.Trim().ToUpper(),
                PhoneNumber = model.PhoneNumber?.Trim(),
                FirstName = model.FirstName?.Trim(),
                LastName = model.LastName?.Trim(),
                Street = model.Street?.Trim(),
                City = model.City?.Trim(),
                State = model.State?.Trim(),
                Country = model.Country?.Trim(),
                ZipCode = model.ZipCode?.Trim(),
                UserTheme = model.UserTheme?.Trim(),
                ProfileImage = model.ProfileImage?.Trim()
            };

            #region Check duplicate of username, email and phone

            var (existsUserName, errorUserName) = await ExistsUserName(user.NormalizedUserName);
            var (existsEmail, errorEmail) = await ExistsEmail(user.NormalizedEmail);
            var (existsPhone, errorPhone) = await ExistsPhone(user.PhoneNumber);

            if (existsUserName || existsEmail || existsPhone)
            {
                var e = new DuplicateException("UserName/Email/phone already exists.");
                if (existsUserName)
                {
                    e.Data.Add("UserName", errorUserName);
                }
                if (existsEmail)
                {
                    e.Data.Add("Email", errorEmail);
                }

                if (existsPhone)
                {
                    e.Data.Add("Phone", errorPhone);
                }

                throw e;
            }

            #endregion Check duplicate of username, email and phone

            string password = PasswordStorage.GenerateRandomPassword();
            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                result = await _userManager.AddToRoleAsync(user, role.ToString());
                if (result.Succeeded)
                {
                    await SendInvite(new SendInviteDto { UserId = user.Id, BaseUrl = baseUrl });
                }
            }
            return user;
        }

        #region Private methods

        private async Task<(bool, string)> ExistsUserName(string userName, int? userId = null)
        {
            string userNameUpper = userName.ToUpper();

            bool exists;
            if (userId == null)
                exists = await _userManager.Users.AnyAsync(x => x.NormalizedUserName == userNameUpper);
            else
                exists = await _userManager.Users.AnyAsync(x => x.NormalizedUserName == userNameUpper && x.Id != userId);

            if (exists)
            {
                return (true, $"Username '{userName}' is already exists");
            }
            else
            {
                return (false, string.Empty);
            }
        }

        private async Task<(bool, string)> ExistsEmail(string email, int? userId = null)
        {
            string emailUpper = email.ToUpper();

            bool exists;
            if (userId == null)
                exists = await _userManager.Users.AnyAsync(x => x.NormalizedEmail == emailUpper);
            else
                exists = await _userManager.Users.AnyAsync(x => x.NormalizedEmail == emailUpper && x.Id != userId);

            if (exists)
            {
                return (true, $"Email '{email}' is already exists");
            }
            else
            {
                return (false, string.Empty);
            }
        }

        private async Task<(bool, string)> ExistsPhone(string? phone, int? userId = null)
        {
            if (phone == null)
                return (false, string.Empty);

            bool exists;
            if (userId == null)
                exists = await _userManager.Users.AnyAsync(x => x.PhoneNumber == phone);
            else
                exists = await _userManager.Users.AnyAsync(x => x.PhoneNumber == phone && x.Id != userId);

            if (exists)
            {
                return (true, $"Phone '{phone}' is already exists");
            }
            else
            {
                return (false, string.Empty);
            }
        }

        //private async Task<bool> IsIdExists(int id)
        //{
        //    return await _userManager.Users.AnyAsync(x => x.Id == id);
        //}

        #endregion Private methods
    }
}

// https://docs.microsoft.com/en-us/aspnet/identity/overview/features-api/account-confirmation-and-password-recovery-with-aspnet-identity