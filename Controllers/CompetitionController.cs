using CompetitionsTest.DTOs.Competition;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompetitionController(IServiceManager _serviceManager) : ControllerBase
    {

        [HttpPost()]
        public async Task<IActionResult> Create([FromBody] CreateCompetitionDto dto)
        {
            var result = await _serviceManager.CompetitionService.CreateAsync(dto);
            return Ok(result);
        }

        [HttpGet()]
        public async Task<IActionResult> GetAll()
        {
            var result = await _serviceManager.CompetitionService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _serviceManager.CompetitionService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCompetitionDto dto)
        {
            var result = await _serviceManager.CompetitionService.UpdateAsync(id, dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _serviceManager.CompetitionService.DeleteAsync(id);
            return Ok();
        }
    }
}
