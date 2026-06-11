using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompetitionsTest.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Competition",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Competition", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CompetitionDays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DayNum = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompetitionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompetitionDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompetitionDays_Competition_CompetitionId",
                        column: x => x.CompetitionId,
                        principalTable: "Competition",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
                    QuestionMark = table.Column<int>(type: "int", nullable: false),
                    CompetitionDayId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_CompetitionDays_CompetitionDayId",
                        column: x => x.CompetitionDayId,
                        principalTable: "CompetitionDays",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LinearScaleConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MinValue = table.Column<int>(type: "int", nullable: false),
                    MaxValue = table.Column<int>(type: "int", nullable: false),
                    MinLabel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaxLabel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuestionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LinearScaleConfigurations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LinearScaleConfigurations_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MultipleChoiceGridConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MultipleChoiceGridConfigurations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MultipleChoiceGridConfigurations_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionAnswer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AnswerData = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionAnswer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionAnswer_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionOptions_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GridColumns",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GridConfigurationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GridColumns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GridColumns_MultipleChoiceGridConfigurations_GridConfigurationId",
                        column: x => x.GridConfigurationId,
                        principalTable: "MultipleChoiceGridConfigurations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GridRows",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GridConfigurationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GridRows", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GridRows_MultipleChoiceGridConfigurations_GridConfigurationId",
                        column: x => x.GridConfigurationId,
                        principalTable: "MultipleChoiceGridConfigurations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompetitionDays_CompetitionId",
                table: "CompetitionDays",
                column: "CompetitionId");

            migrationBuilder.CreateIndex(
                name: "IX_GridColumns_GridConfigurationId",
                table: "GridColumns",
                column: "GridConfigurationId");

            migrationBuilder.CreateIndex(
                name: "IX_GridRows_GridConfigurationId",
                table: "GridRows",
                column: "GridConfigurationId");

            migrationBuilder.CreateIndex(
                name: "IX_LinearScaleConfigurations_QuestionId",
                table: "LinearScaleConfigurations",
                column: "QuestionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MultipleChoiceGridConfigurations_QuestionId",
                table: "MultipleChoiceGridConfigurations",
                column: "QuestionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAnswer_QuestionId",
                table: "QuestionAnswer",
                column: "QuestionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOptions_QuestionId",
                table: "QuestionOptions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_CompetitionDayId",
                table: "Questions",
                column: "CompetitionDayId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GridColumns");

            migrationBuilder.DropTable(
                name: "GridRows");

            migrationBuilder.DropTable(
                name: "LinearScaleConfigurations");

            migrationBuilder.DropTable(
                name: "QuestionAnswer");

            migrationBuilder.DropTable(
                name: "QuestionOptions");

            migrationBuilder.DropTable(
                name: "MultipleChoiceGridConfigurations");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "CompetitionDays");

            migrationBuilder.DropTable(
                name: "Competition");
        }
    }
}
