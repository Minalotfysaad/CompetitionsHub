    using CompetitionsTest.DTOs;
using CompetitionsTest.DTOs.Competition;
using CompetitionsTest.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers
{
    [Authorize(Roles = "admins")]
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

        //[HttpGet()]
        //public async Task<IActionResult> GetAll()
        //{
        //    var result = await _serviceManager.CompetitionService.GetAllAsync();
        //    return Ok(result);
        //}


        [HttpGet]
        public async Task<ActionResult<PaginationResponse<CompetitionListDto>>> GetAllAsync([FromQuery] CompetitionQueryParams queryParams)
        {
            var result = await _serviceManager.CompetitionService.GetAllAsync(queryParams);
            return Ok(result);
        }
        
        [AllowAnonymous] // Replaced with roles or kept AllowAnonymous? wait, let's use [Authorize(Roles = "admins,contestants")]
        [Authorize(Roles = "admins,contestants")]
        [HttpGet("active")]
        public async Task<ActionResult<PaginationResponse<CompetitionListDto>>> GetActiveAsync([FromQuery] CompetitionQueryParams queryParams)
        {
            var result = await _serviceManager.CompetitionService.GetActiveCompetitionsAsync(queryParams);
            return Ok(result);
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _serviceManager.CompetitionService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCompetitionDto dto)
        {
            var result = await _serviceManager.CompetitionService.UpdateAsync(id, dto);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _serviceManager.CompetitionService.DeleteAsync(id);
            return Ok();
        }
    }
}
