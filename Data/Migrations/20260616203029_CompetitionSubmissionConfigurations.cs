using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompetitionsTest.Data.Migrations
{
    /// <inheritdoc />
    public partial class CompetitionSubmissionConfigurations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CompetitionSubmissions_UserId",
                table: "CompetitionSubmissions");

            migrationBuilder.CreateIndex(
                name: "IX_CompetitionSubmissions_UserId_CompetitionDayId",
                table: "CompetitionSubmissions",
                columns: new[] { "UserId", "CompetitionDayId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CompetitionSubmissions_UserId_CompetitionDayId",
                table: "CompetitionSubmissions");

            migrationBuilder.CreateIndex(
                name: "IX_CompetitionSubmissions_UserId",
                table: "CompetitionSubmissions",
                column: "UserId");
        }
    }
}
