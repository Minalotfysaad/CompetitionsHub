using CompetitionsTest.DTOs.CompetitionDay;
using CompetitionsTest.ServiceAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers
{
    [Authorize(Roles = "contestants")]
    [ApiController]
    [Route("api/[controller]")]
    public class CompetitionDayContestantController(IServiceManager _serviceManager) : ControllerBase
    {

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result =await _serviceManager.CompetitionDayService.GetByIdForContestantAsync(id);
            return Ok(result);
        }


        [HttpGet("competition/{competitionId:int}")]
        public async Task<IActionResult>GetByCompetitionId(int competitionId)
        {
            var result =await _serviceManager.CompetitionDayService.GetByCompetitionIdForContestantAsync(competitionId);
            return Ok(result);
        }

        [HttpGet("competition/{competitionId:int}/active")]
        public async Task<IActionResult>GetActiveDay(int competitionId)
        {
            var result =await _serviceManager.CompetitionDayService.GetActiveDayForContestantAsync(competitionId,DateTime.UtcNow);
            if (result is null)
                return NotFound();

            return Ok(result);
        }
    }
}
