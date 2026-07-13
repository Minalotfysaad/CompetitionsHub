using CompetitionsTest.DTOs.Question;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;

namespace CompetitionsTest.Controllers
{
    [Authorize(Roles = "admins")]
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController(IServiceManager _serviceManager)
        : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<QuestionDto>> Create([FromBody] CreateQuestionDto dto)
        {
            var result =await _serviceManager.QuestionService.CreateAsync(dto);
            return Ok(result);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionDto>> GetById(int id)
        {
            var result =await _serviceManager.QuestionService.GetByIdAsync(id);
            return Ok(result);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<QuestionDto>> Update(int id,[FromBody] CreateQuestionDto dto)
        {
            var result =await _serviceManager.QuestionService.UpdateAsync(id, dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _serviceManager.QuestionService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPatch("reorder")]
        public async Task<IActionResult> Reorder([FromBody] List<ReorderQuestionDto> items)
        {
            await _serviceManager.QuestionService.ReorderAsync(items);
            return NoContent();
        }
    }
}
