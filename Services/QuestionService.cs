using AutoMapper;
using CompetitionsTest.DTOs.Question;
using CompetitionsTest.Enums;
using CompetitionsTest.Models;
using CompetitionsTest.Models.QuestionModel;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration.GridQuestion;
using CompetitionsTest.ServiceAbstractions;
using DomainLayer.Contracts;
using GarasForms.Core;

namespace CompetitionsTest.Services
{
    public class QuestionService(IUnitOfWork _unitOfWork, IMapper _mapper) : IQuestionService
    {
        public async Task<QuestionDto> CreateAsync(CreateQuestionDto dto)
        {
            // Validate Competition Day Exists
            var competitionDayRepo =
                _unitOfWork.GetRepository<CompetitionDay, int>();

            var competitionDay =
                await competitionDayRepo.GetByIdAsync(dto.CompetitionDayId);

            if (competitionDay is null)
                throw new Exception("Competition day not found");

            var question = BuildQuestion(dto);

            ApplyQuestionTypeConfiguration(question, dto);

            var questionRepo = _unitOfWork.GetRepository<Question, int>();

            await questionRepo.AddAsync(question);

            await _unitOfWork.SaveChangesAsync();

            var questionDto = _mapper.Map<QuestionDto>(question);
            return questionDto;
        }

        public async Task<QuestionDto> GetByIdAsync(int id)
        {
            var repo = _unitOfWork.GetRepository<Question, int>();

            var question = await repo.FindAsync(
                q => q.Id == id,
                includes:QuestionIncludes);

            if (question is null)
                throw new Exception("Question not found");

            return _mapper.Map<QuestionDto>(question);
        }

        public async Task<IEnumerable<QuestionDto>> GetByCompetitionDayAsync(int competitionDayId)
        {
            var competitionDayRepo =
                _unitOfWork.GetRepository<CompetitionDay, int>();

            var day = await competitionDayRepo.GetByIdAsync(competitionDayId);

            if (day is null)
                throw new Exception("Competition day not found");

            var repo = _unitOfWork.GetRepository<Question, int>();

            var questions = await repo.FindAllAsync(
                q => q.CompetitionDayId == competitionDayId,
                includes: QuestionIncludes);

            return _mapper.Map<IEnumerable<QuestionDto>>(questions);
        }

        public async Task<QuestionDto> UpdateAsync(int id, CreateQuestionDto dto)
        {
            var repo = _unitOfWork.GetRepository<Question, int>();

            var question = await repo.FindAsync(
                q => q.Id == id,
                includes: QuestionIncludes);

            if (question is null)
                throw new Exception("Question not found");

            UpdateQuestion(question, dto);

            ApplyQuestionTypeConfiguration(question, dto);

            repo.Update(question);

            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<QuestionDto>(question);
        }

        public async Task DeleteAsync(int id)
        {
            var repo = _unitOfWork.GetRepository<Question, int>();

            var question = await repo.GetByIdAsync(id);

            if (question is null)
                throw new Exception("Question not found");

            repo.Delete(question);

            await _unitOfWork.SaveChangesAsync();
        }




        #region Helpers

        private static readonly string[] QuestionIncludes =
            [
                "Options",
                "CorrectAnswer",
                "LinearScaleConfiguration",
                "GridConfiguration",
                "GridConfiguration.Rows",
                "GridConfiguration.Columns",
                "GridConfiguration.AnswerKeys"
            ];
        private static Question BuildQuestion(CreateQuestionDto dto)
        {
            return new Question
            {
                Title = dto.Title,
                Description = dto.Description,
                Type = dto.Type,
                IsRequired = dto.IsRequired,
                QuestionMark = dto.QuestionMark,
                DisplayOrder = dto.DisplayOrder,
                CompetitionDayId = dto.CompetitionDayId
            };
        }

        private static void UpdateQuestion(Question question, CreateQuestionDto dto)
        {
            question.Title = dto.Title;
            question.Description = dto.Description;
            question.Type = dto.Type;
            question.IsRequired = dto.IsRequired;
            question.QuestionMark = dto.QuestionMark;
            question.DisplayOrder = dto.DisplayOrder;

            // Clear previous config
            question.Options?.Clear();
            question.CorrectAnswer = null;
            question.LinearScaleConfiguration = null;
            question.GridConfiguration = null;
        }

        private static void ApplyQuestionTypeConfiguration(Question question, CreateQuestionDto dto)
        {
            switch (dto.Type)
            {
                case QuestionType.MultipleChoice:
                    ConfigureMultipleChoice(question, dto);
                    break;

                case QuestionType.LinearScale:
                    ConfigureLinearScale(question, dto);
                    break;

                case QuestionType.ShortAnswer:
                    ConfigureShortAnswer(question, dto);
                    break;

                case QuestionType.Paragraph:
                    ConfigureParagraph(question);
                    break;
                case QuestionType.Grid:
                    ConfigureGrid(question, dto);
                    break;

                default:
                    throw new Exception("Unsupported question type");
            }
        }

        private static void ConfigureMultipleChoice(Question question, CreateQuestionDto dto)
        {
            if (dto.MultipleChoice is null)
                throw new Exception("Multiple choice configuration is required");

            if (dto.MultipleChoice.Options.Count < 2)
                throw new Exception("At least two options are required");

            if (dto.MultipleChoice.CorrectOptionIndex < 0 ||
                dto.MultipleChoice.CorrectOptionIndex >= dto.MultipleChoice.Options.Count)
                throw new Exception("Invalid correct option index");

            question.Options = dto.MultipleChoice.Options
                .Select(o => new QuestionOption
                {
                    Text = o
                })
                .ToList();

            question.CorrectAnswer = new QuestionAnswerKey
            {
                AnswerData =
                    dto.MultipleChoice.CorrectOptionIndex.ToString()
            };
        }

        private static void ConfigureLinearScale(Question question, CreateQuestionDto dto)
        {
            if (dto.LinearScale is null)
                throw new Exception("Linear scale configuration is required");

            if (dto.LinearScale.MinValue >= dto.LinearScale.MaxValue)
                throw new Exception("MinValue must be less than MaxValue");

            if (dto.LinearScale.CorrectValue <
                dto.LinearScale.MinValue ||
                dto.LinearScale.CorrectValue >
                dto.LinearScale.MaxValue)
                throw new Exception("Correct value must be inside the scale range");

            question.LinearScaleConfiguration =
                new LinearScaleConfiguration
                {
                    MinValue = dto.LinearScale.MinValue,
                    MaxValue = dto.LinearScale.MaxValue,
                    MinLabel = dto.LinearScale.MinLabel,
                    MaxLabel = dto.LinearScale.MaxLabel
                };

            question.CorrectAnswer =
                new QuestionAnswerKey
                {
                    AnswerData =
                        dto.LinearScale.CorrectValue.ToString()
                };
        }

        private static void ConfigureShortAnswer(Question question, CreateQuestionDto dto)
        {
            if (dto.Text is null)
                throw new Exception("Text configuration is required");

            if (string.IsNullOrWhiteSpace(dto.Text.CorrectAnswer))
                throw new Exception("Correct answer is required");

            question.CorrectAnswer =
                new QuestionAnswerKey
                {
                    AnswerData =
                        dto.Text.CorrectAnswer.Trim()
                };
        }

        private static void ConfigureParagraph(Question question)
        {
            // Paragraph questions do not have a correct answer.
        }

        private static void ConfigureGrid(Question question,CreateQuestionDto dto)
        {
            if (dto.Grid is null)
                throw new Exception("Grid configuration is required");

            ValidateGrid(dto.Grid);

            question.GridConfiguration = new GridConfiguration
                {
                    Rows = dto.Grid.Rows
                        .Select(r => new GridRow
                        {
                            Text = r
                        })
                        .ToList(),

                    Columns = dto.Grid.Columns
                        .Select(c => new GridColumn
                        {
                            Text = c
                        })
                        .ToList(),

                    AnswerKeys = dto.Grid.AnswerKeys
                        .Select(a => new GridAnswerKey
                        {
                            RowKey = a.RowKey,
                            ColumnKey = a.ColumnKey
                        })
                        .ToList()
                };
        }

        private static void ValidateGrid(GridDto grid)
        {
            if (!grid.Rows.Any())
                throw new Exception("Grid must contain at least one row");

            if (!grid.Columns.Any())
                throw new Exception("Grid must contain at least one column");

            if (!grid.AnswerKeys.Any())
                throw new Exception("Grid must contain at least one answer key");

            if (grid.Rows.Count != grid.Rows.Distinct(StringComparer.OrdinalIgnoreCase).Count())
                throw new Exception("Duplicate rows are not allowed");

            if (grid.Columns.Count != grid.Columns.Distinct(StringComparer.OrdinalIgnoreCase).Count())
                throw new Exception("Duplicate columns are not allowed");

            foreach (var answer in grid.AnswerKeys)
            {
                if (!grid.Rows.Contains(answer.RowKey,StringComparer.OrdinalIgnoreCase))
                    throw new Exception($"Row '{answer.RowKey}' does not exist");

                if (!grid.Columns.Contains(answer.ColumnKey,StringComparer.OrdinalIgnoreCase))
                    throw new Exception($"Column '{answer.ColumnKey}' does not exist");
            }

            bool duplicateAnswersForRow = grid.AnswerKeys.GroupBy(a => a.RowKey,StringComparer.OrdinalIgnoreCase).Any(g => g.Count() > 1);

            if (duplicateAnswersForRow)
                throw new Exception("A row can only have one correct answer");

            foreach (var row in grid.Rows)
                if (!grid.AnswerKeys.Any(a => string.Equals(a.RowKey,row,StringComparison.OrdinalIgnoreCase)))
                    throw new Exception($"Row '{row}' is missing an answer");
        }


        #endregion
    }
}

