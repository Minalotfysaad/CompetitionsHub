using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompetitionsTest.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddingDbSets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompetitionDays_Competition_CompetitionId",
                table: "CompetitionDays");

            migrationBuilder.DropForeignKey(
                name: "FK_GridAnswerKey_MultipleChoiceGridConfigurations_GridConfigurationId",
                table: "GridAnswerKey");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionAnswerKey_Questions_QuestionId",
                table: "QuestionAnswerKey");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QuestionAnswerKey",
                table: "QuestionAnswerKey");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GridAnswerKey",
                table: "GridAnswerKey");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Competition",
                table: "Competition");

            migrationBuilder.RenameTable(
                name: "QuestionAnswerKey",
                newName: "QuestionAnswerKeys");

            migrationBuilder.RenameTable(
                name: "GridAnswerKey",
                newName: "GridAnswerKeys");

            migrationBuilder.RenameTable(
                name: "Competition",
                newName: "Competitions");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionAnswerKey_QuestionId",
                table: "QuestionAnswerKeys",
                newName: "IX_QuestionAnswerKeys_QuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_GridAnswerKey_GridConfigurationId",
                table: "GridAnswerKeys",
                newName: "IX_GridAnswerKeys_GridConfigurationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuestionAnswerKeys",
                table: "QuestionAnswerKeys",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GridAnswerKeys",
                table: "GridAnswerKeys",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Competitions",
                table: "Competitions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CompetitionDays_Competitions_CompetitionId",
                table: "CompetitionDays",
                column: "CompetitionId",
                principalTable: "Competitions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GridAnswerKeys_MultipleChoiceGridConfigurations_GridConfigurationId",
                table: "GridAnswerKeys",
                column: "GridConfigurationId",
                principalTable: "MultipleChoiceGridConfigurations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionAnswerKeys_Questions_QuestionId",
                table: "QuestionAnswerKeys",
                column: "QuestionId",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompetitionDays_Competitions_CompetitionId",
                table: "CompetitionDays");

            migrationBuilder.DropForeignKey(
                name: "FK_GridAnswerKeys_MultipleChoiceGridConfigurations_GridConfigurationId",
                table: "GridAnswerKeys");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionAnswerKeys_Questions_QuestionId",
                table: "QuestionAnswerKeys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QuestionAnswerKeys",
                table: "QuestionAnswerKeys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GridAnswerKeys",
                table: "GridAnswerKeys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Competitions",
                table: "Competitions");

            migrationBuilder.RenameTable(
                name: "QuestionAnswerKeys",
                newName: "QuestionAnswerKey");

            migrationBuilder.RenameTable(
                name: "GridAnswerKeys",
                newName: "GridAnswerKey");

            migrationBuilder.RenameTable(
                name: "Competitions",
                newName: "Competition");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionAnswerKeys_QuestionId",
                table: "QuestionAnswerKey",
                newName: "IX_QuestionAnswerKey_QuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_GridAnswerKeys_GridConfigurationId",
                table: "GridAnswerKey",
                newName: "IX_GridAnswerKey_GridConfigurationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuestionAnswerKey",
                table: "QuestionAnswerKey",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GridAnswerKey",
                table: "GridAnswerKey",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Competition",
                table: "Competition",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CompetitionDays_Competition_CompetitionId",
                table: "CompetitionDays",
                column: "CompetitionId",
                principalTable: "Competition",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GridAnswerKey_MultipleChoiceGridConfigurations_GridConfigurationId",
                table: "GridAnswerKey",
                column: "GridConfigurationId",
                principalTable: "MultipleChoiceGridConfigurations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionAnswerKey_Questions_QuestionId",
                table: "QuestionAnswerKey",
                column: "QuestionId",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
