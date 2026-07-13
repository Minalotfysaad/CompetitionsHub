using CompetitionsTest.ServiceAbstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers;

    [Authorize(Roles = "contestants")]
    [ApiController]
    [Route("api/[controller]")]
    public class ContestantResultsController(IServiceManager _serviceManager) : ControllerBase
    {
        [HttpGet("{userId}")]
        public async Task<IActionResult>GetUserResults(string userId)
        {
            var result =await _serviceManager.ContestantResultsService.GetUserResultsAsync(userId);
            return Ok(result);
        }
}