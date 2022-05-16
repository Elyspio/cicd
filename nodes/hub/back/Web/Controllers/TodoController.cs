using Cicd.Hub.Abstractions.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Cicd.Hub.Api.Web.Controllers
{
	[Route("api/todo")]
	[ApiController]
	public class TodoController : ControllerBase
	{
		private readonly ITodoService todoService;

		public TodoController(ITodoService todoService)
		{
			this.todoService = todoService;
		}

		[HttpGet]
		[SwaggerResponse(204)]
		public async Task<IActionResult> GetAll()
		{
			await todoService.Test();
			return NoContent();
		}
	}
}