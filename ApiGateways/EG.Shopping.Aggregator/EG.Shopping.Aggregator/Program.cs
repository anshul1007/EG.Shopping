using Carter;
using EG.Shopping.Aggregator.Behaviors;
using EG.Shopping.Aggregator.Exceptions.Handler;
using EG.Shopping.Aggregator.Services;
using FluentValidation;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, services, loggerConfiguration) =>
{
    // Configure here Serilog instance...
    loggerConfiguration
        .MinimumLevel.Information()
        .Enrich.WithProperty("ApplicationContext", "EG.Shopping.Aggregator")
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .ReadFrom.Configuration(context.Configuration);
});

//Application Services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient<ICartRepository, CartRepository>();

var assembly = typeof(Program).Assembly;
builder.Services.AddMediatR(config =>
{
    config.RegisterServicesFromAssembly(assembly);
    config.AddOpenBehavior(typeof(ValidationBehavior<,>));
    config.AddOpenBehavior(typeof(LoggingBehavior<,>));
});
builder.Services.AddValidatorsFromAssembly(assembly);

builder.Services.AddCarter();

// builder.Services.AddScoped<ICartRepository, CartRepository>();
// var httpClientBuilder = builder.Services.AddHttpClient<ICartRepository, CartRepository>()
//     .ConfigureHttpClient((s, c) =>
//     {
//         // access the DI container
//         c.BaseAddress = new Uri("https://localhost:7247");
//     });
// httpClientBuilder.SetHandlerLifetime(TimeSpan.FromMinutes(5));


// builder.Services.AddHttpClient<ICartRepository, CartRepository>();
// builder.Services.Decorate<IDataRepository, CachedDataRepository>();

// //Add Services
// builder.Services.AddHttpClient<ICartRepository>(options =>
//     {
//         options.BaseAddress = new Uri(builder.Configuration["https://localhost:7247"]!);
//     })
//     .ConfigurePrimaryHttpMessageHandler(() =>
//     {
//         var handler = new HttpClientHandler
//         {
//             ServerCertificateCustomValidationCallback =
//                 HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
//         };
//
//         return handler;
//     });

// Configure health checks
builder.Services
    .AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);
// .AddNpgSql(builder.Configuration.GetConnectionString("Database")!);


//Cross-Cutting Services
builder.Services.AddExceptionHandler<CustomExceptionHandler>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapCarter();

app.UseSwagger();
app.UseSwaggerUI();

app.UseExceptionHandler(options => { });
app.UseHealthChecks("/hc",
    new HealthCheckOptions
    {
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
    });

app.Run();