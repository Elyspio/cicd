using System.Net;
using System.Text.Json.Serialization;
using Cicd.Hub.Abstractions.Common.Helpers;
using Cicd.Hub.Abstractions.Interfaces.Injections;
using Cicd.Hub.Adapters.Injections;
using Cicd.Hub.Core.Injections;
using Cicd.Hub.Db.Injections;
using Cicd.Hub.Web.Server.Utils;
using Cicd.Hub.Web.Server.Utils.Filters;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Logging.Console;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Converters;

namespace Cicd.Hub.Web.Server
{
	public class ServerBuilder
	{
		private readonly string appPath = "/example";
		private readonly string frontPath = Env.Get("FRONT_PATH", "/front");

		public ServerBuilder(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);


			builder.WebHost.ConfigureKestrel((_, options) => {
					options.Listen(IPAddress.Any, 4000, listenOptions => {
							// Use HTTP/3
							listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
						}
					);
				}
			);


			// Setup CORS
			builder.Services.AddCors(options => {
					options.AddPolicy("Cors", b => {
							b.AllowAnyOrigin();
							b.AllowAnyHeader();
							b.AllowAnyMethod();
						}
					);

					options.DefaultPolicyName = "Cors";
				}
			);


			builder.Services.AddModule<AdapterModule>(builder.Configuration);
			builder.Services.AddModule<CoreModule>(builder.Configuration);
			builder.Services.AddModule<DatabaseModule>(builder.Configuration);


			builder.Services.AddSignalR(options => { options.EnableDetailedErrors = true; })
				.AddJsonProtocol(options => {
						options.PayloadSerializerOptions.IncludeFields = true;
						options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
					}
				);
			;

			// Setup Logging
			builder.Logging.ClearProviders()
				.AddSimpleConsole(options => {
						options.SingleLine = true;
						options.ColorBehavior = LoggerColorBehavior.Enabled;
						options.TimestampFormat = "HH:mm:ss ";
					}
				);


			// Convert Enum to String 
			builder.Services.AddControllers(o => {
						o.Conventions.Add(new ControllerDocumentationConvention());
						o.OutputFormatters.RemoveType<StringOutputFormatter>();
					}
				)
				.AddJsonOptions(options => { options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); })
				.AddNewtonsoftJson(x => { x.SerializerSettings.Converters.Add(new StringEnumConverter()); });

			// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen(options => {
					if (builder.Environment.IsProduction())
						options.AddServer(new OpenApiServer
							{
								Url = appPath
							}
						);

					options.SwaggerDoc("v1", new OpenApiInfo {Title = "CICD Hub", Version = "1"});

					options.CustomOperationIds(e => $"{e.ActionDescriptor.RouteValues["action"]}");

					options.OperationFilter<RequireAuthAttribute.Swagger>();
				}
			);

			// Setup SPA Serving
			if (builder.Environment.IsProduction()) Console.WriteLine($"Server in production, serving SPA from {frontPath} folder");

			Application = builder.Build();
		}

		public WebApplication Application { get; }
	}
}