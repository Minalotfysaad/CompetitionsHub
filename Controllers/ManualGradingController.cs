using CompetitionsTest.DTOs.Manual_Review;
using CompetitionsTest.ServiceAbstractions;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ManualGradingController(IServiceManager _serviceManager) : ControllerBase
    {


        // Get competitions that have pending paragraph reviews
        [HttpGet("competitions")]
        public async Task<IActionResult> GetCompetitionsWithPendingReviews()
        {
            var result = await _serviceManager.ManualGradingService.GetCompetitionsWithPendingReviewsAsync();
            return Ok(result);
        }


        // Get competition days that have pending paragraph reviews
        [HttpGet("competitions/{competitionId:int}/days")]
        public async Task<IActionResult> GetCompetitionDaysWithPendingReviews(int competitionId)
        {
            var result = await _serviceManager.ManualGradingService.GetCompetitionDaysWithPendingReviewsAsync(competitionId);
            return Ok(result);
        }


        // Get paragraph questions that require grading
        [HttpGet("days/{competitionDayId:int}/questions")]
        public async Task<IActionResult> GetParagraphQuestions(int competitionDayId)
        {
            var result =await _serviceManager.ManualGradingService.GetParagraphQuestionsAsync(competitionDayId);
            return Ok(result);
        }

        // Get paragraph questions that have already been graded (history)
        [HttpGet("days/{competitionDayId:int}/graded-questions")]
        public async Task<IActionResult> GetGradedQuestions(int competitionDayId)
        {
            var result = await _serviceManager.ManualGradingService.GetGradedQuestionsAsync(competitionDayId);
            return Ok(result);
        }

        // Get all contestants answers for a specific paragraph question
        [HttpGet("questions/{questionId:int}")]
        public async Task<IActionResult> GetQuestionReviewDetails(int questionId)
        {
            var result = await _serviceManager.ManualGradingService.GetQuestionReviewDetailsAsync(questionId);
            return Ok(result);
        }


        // Grade a contestant answer
        [HttpPost("responses/{responseId:int}")]
        public async Task<IActionResult> GradeResponse(int responseId,[FromBody] GradeResponseDto dto)
        {
            await _serviceManager.ManualGradingService.GradeResponseAsync(responseId, dto);
            return NoContent();
        }

    }
}