using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers
{
    [Authorize(Roles = "admins")]
    [ApiController]
    [Route("api/[controller]")]
    public class CompetitionDayResultsController(IServiceManager serviceManager) : ControllerBase
    {
        [HttpGet("{competitionDayId:int}")]
        public async Task<IActionResult>GetCompetitionDayResults(int competitionDayId)
        {
            var result = await serviceManager.CompetitionDayResultsService.GetCompetitionDayResultsAsync(competitionDayId);
            return Ok(result);
        }
    }
}
