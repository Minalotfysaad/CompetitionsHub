using CompetitionsTest.Data.Configurations;
using CompetitionsTest.Models;
using CompetitionsTest.Models.MultipleChoiceGridQuestion;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace CompetitionsTest.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(Configurations.AssemblyReference).Assembly);
        }

        //Dbsets Properties
        public DbSet<CompetitionDay> CompetitionDays { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<QuestionOption> QuestionOptions { get; set; }
        public DbSet<MultipleChoiceGridConfiguration> MultipleChoiceGridConfigurations { get; set; }
        public DbSet<GridColumn> GridColumns { get; set; }
        public DbSet<GridRow> GridRows { get; set; }
        public DbSet<LinearScaleConfiguration> LinearScaleConfigurations { get; set; }



    }
}
