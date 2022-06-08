using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Web.Hubs;

namespace Cicd.Hub.Web.Server
{
	public static class ApplicationServer
	{
		public static WebApplication Initialize(this WebApplication application)
		{
			// Allow CORS
			application.UseCors("Cors");

			application.UseSwagger();
			application.UseSwaggerUI();

			// Start Dependency Injection
			application.UseAdvancedDependencyInjection();

			// Setup Controllers
			application.MapControllers();

			application.UseAuthentication();

			application.MapHub<FrontHub>("/ws/front");
			application.MapHub<AgentsHub>("/ws/agents");

			// Start SPA serving
			if (application.Environment.IsProduction())
			{
				application.UseRouting();

				application.UseDefaultFiles(new DefaultFilesOptions
					{
						DefaultFileNames = new List<string> {"index.html"},
						RedirectToAppendTrailingSlash = true
					}
				);
				application.UseStaticFiles();

				application.UseEndpoints(endpoints => { endpoints.MapFallbackToFile("/index.html"); });
			}


			var engine = application.Services.GetService<IEngineService>();
			engine.Watch();

			return application;
		}
	}
}