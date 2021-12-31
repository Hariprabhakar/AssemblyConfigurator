using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IdentityService.Migrations
{
    public partial class UserFirstName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "confirm_email_code",
                table: "inspire_users");

            migrationBuilder.DropColumn(
                name: "reset_password_code",
                table: "inspire_users");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "inspire_users",
                newName: "first_name");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "first_name",
                table: "inspire_users",
                newName: "name");

            migrationBuilder.AddColumn<string>(
                name: "confirm_email_code",
                table: "inspire_users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "reset_password_code",
                table: "inspire_users",
                type: "text",
                nullable: true);
        }
    }
}