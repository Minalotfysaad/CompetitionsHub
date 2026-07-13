using CompetitionsTest.DTOs.CompetitionDay;
using CompetitionsTest.ServiceAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers
{
    [Authorize(Roles = "admins")]
    [ApiController]
    [Route("api/[controller]")]
    public class CompetitionDayAdminController(IServiceManager _serviceManager) : ControllerBase
    {

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCompetitionDayDto dto)
        {
            var result = await _serviceManager.CompetitionDayService.CreateAsync(dto);
            return Ok(result);
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _serviceManager.CompetitionDayService.GetByIdAsync(id);
            return Ok(result);
        }


        [HttpGet("competition/{competitionId:int}")]
        public async Task<IActionResult> GetByCompetitionId(int competitionId)
        {
            var result = await _serviceManager.CompetitionDayService.GetByCompetitionIdAsync(competitionId);
            return Ok(result);
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCompetitionDayDto dto)
        {
            var result = await _serviceManager.CompetitionDayService.UpdateAsync(id, dto);
            return Ok(result);
        }


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _serviceManager.CompetitionDayService.DeleteAsync(id);
            return NoContent();
        }



        [HttpGet("competition/{competitionId:int}/active")]
        public async Task<IActionResult> GetActiveDay(int competitionId)
        {
            var result = await _serviceManager.CompetitionDayService.GetActiveDayAsync(
                competitionId,
                DateTime.UtcNow);

            if (result is null)
                return NotFound("No active competition day found");

            return Ok(result);
        }
    }
}
