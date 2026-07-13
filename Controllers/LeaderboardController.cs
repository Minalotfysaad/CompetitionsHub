using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers
{
    [Authorize(Roles = "admins,contestants")]
    [Route("api/[controller]")]
    [ApiController]
    public class LeaderboardController(IServiceManager _serviceManager) : ControllerBase
    {
        [HttpGet("day/{competitionDayId:int}")]
        public async Task<IActionResult>GetCompetitionDayLeaderboard(int competitionDayId)
        {
            var result = await _serviceManager.LeaderboardService.GetCompetitionDayLeaderboardAsync(competitionDayId);
            return Ok(result);
        }


        [HttpGet("competition/{competitionId:int}")]public async Task<IActionResult>GetCompetitionLeaderboard(int competitionId)
        {
            var result =await _serviceManager.LeaderboardService.GetCompetitionLeaderboardAsync(competitionId);
            return Ok(result);
        }
    }
}
