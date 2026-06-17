using CompetitionsTest.DTOs.Submission;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController(IServiceManager _serviceManager) : ControllerBase
    {

        // Start a new submission. If the user already has a submission for this day, it returns the existing one.
        [HttpPost("start")]
        public async Task<IActionResult> Start([FromBody] StartSubmissionDto dto)
        {
            var result =await _serviceManager.SubmissionService.StartSubmissionAsync(dto);
            return Ok(result);
        }


        // Get submission with saved answers (Used when loading/resuming the competition)
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result =await _serviceManager.SubmissionService.GetSubmissionByIdAsync(id);
            return Ok(result);
        }


        // Autosave answer
        [HttpPost("answer")]
        public async Task<IActionResult> SaveAnswer([FromBody] SaveAnswerDto dto)
        {
            var result =await _serviceManager.SubmissionService.AutoSaveAnswerAsync(dto);
            return Ok(result);
        }

        // Final submit (Locks the submission and moves it to grading phase)
        [HttpPost("{id:int}/submit")]
        public async Task<IActionResult> Submit(int id)
        {
            var result =await _serviceManager.SubmissionService.SubmitAsync(id);

            return Ok(result);
        }
    }
}
