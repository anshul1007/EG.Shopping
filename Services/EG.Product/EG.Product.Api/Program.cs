using Carter;
using EG.Product.Api.Behaviors;
using EG.Product.Api.Data;
using EG.Product.Api.Exceptions.Handler;
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
        .Enrich.WithProperty("ApplicationContext", "EG.Product.Api")
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .ReadFrom.Configuration(context.Configuration);
});

//Application Services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var assembly = typeof(Program).Assembly;
// builder.Services.AddCarter();
builder.Services.AddMediatR(config =>
{
    config.RegisterServicesFromAssembly(assembly);
    config.AddOpenBehavior(typeof(ValidationBehavior<,>));
    config.AddOpenBehavior(typeof(LoggingBehavior<,>));
});
builder.Services.AddValidatorsFromAssembly(assembly);

builder.Services.AddCarter();

// builder.Services.AddMarten(opts => { opts.Connection(builder.Configuration.GetConnectionString("Database")!); })
//     .UseLightweightSessions();

// if (builder.Environment.IsDevelopment())
//     builder.Services.InitializeMartenWith<ProductInitialData>();

builder.Services.AddScoped<IDataRepository, DataRepository>();
// builder.Services.Decorate<IDataRepository, CachedDataRepository>();

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