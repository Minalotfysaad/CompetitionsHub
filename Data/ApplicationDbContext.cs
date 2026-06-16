using CompetitionsTest.Models;
using CompetitionsTest.Models.Identity;
using CompetitionsTest.Models.QuestionModel;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration.GridQuestion;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace CompetitionsTest.Data
{
    public class ApplicationDbContext: IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AssemblyReference).Assembly);
        }

        //Dbsets Properties
        public DbSet<Competition> Competitions { get; set; }
        public DbSet<CompetitionDay> CompetitionDays { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<QuestionOption> QuestionOptions { get; set; }
        public DbSet<QuestionAnswerKey> QuestionAnswerKeys { get; set; }
        public DbSet<LinearScaleConfiguration> LinearScaleConfigurations { get; set; }
        public DbSet<GridConfiguration> GridConfigurations { get; set; }
        public DbSet<GridColumn> GridColumns { get; set; }
        public DbSet<GridRow> GridRows { get; set; }
        public DbSet<GridAnswerKey> GridAnswerKeys { get; set; }

        
        public DbSet<CompetitionSubmission> CompetitionSubmissions { get; set; }
        public DbSet<QuestionResponse> QuestionResponses { get; set; }



    }
}
