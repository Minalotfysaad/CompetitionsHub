using CompetitionsTest.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CompetitionsTest.Data.Configurations
{
    public class QuestionResponseConfiguration : IEntityTypeConfiguration<QuestionResponse>
    {
        public void Configure(EntityTypeBuilder<QuestionResponse> builder)
        {
            builder.HasOne(qr => qr.CompetitionSubmission)
            .WithMany(s => s.Responses)
            .HasForeignKey(qr => qr.CompetitionSubmissionId)
            .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(qr => qr.Question)
            .WithMany()
            .HasForeignKey(qr => qr.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
