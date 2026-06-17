using CompetitionsTest.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CompetitionsTest.Data.Configurations
{
    public class CompetitionSubmissionConfigurations : IEntityTypeConfiguration<CompetitionSubmission>
    {
        public void Configure(EntityTypeBuilder<CompetitionSubmission> builder)
        {
            builder.HasIndex(s => new
            {
                s.UserId,
                s.CompetitionDayId
            }).IsUnique();
        }
    }
}
