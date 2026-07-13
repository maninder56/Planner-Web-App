using API.Handler;
using API.Policies.Requirements;
using API.ServiceRegistrationExtensions;
using API.SignalR.Extensions;
using DatabaseContext;
using DatabaseContext.Types; 
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsProduction())
{
    // Configuring Serilog logger
    Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Information()
        .MinimumLevel.Override("System", LogEventLevel.Warning)
        .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
        .MinimumLevel.Override("API", LogEventLevel.Information)
        .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Warning)
        .WriteTo.Console()
        .WriteTo.File(
            path: Path.Combine("Logs", "log-.json"),
            restrictedToMinimumLevel: LogEventLevel.Information,
            fileSizeLimitBytes: 100_000_000, // file limit is 100 MB
            rollingInterval: RollingInterval.Day,
            rollOnFileSizeLimit: true,
            retainedFileCountLimit: 30,
            formatter: new CompactJsonFormatter())
        .Enrich.FromLogContext()
        .CreateLogger();

    builder.Host.UseSerilog();
}


// Add services to the container.
builder.Services.AddControllers()
    // Add json convertor for enum values
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());   
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddProblemDetails();


// Add SignalR serivce
builder.Services.AddSignalR()
    .AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.PayloadSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull; 
    });


// Add database services
builder.Services.AddDatabaseService(builder.Configuration);


// CORS Policy
builder.Services.AddCorsPolicy(builder.Configuration); 

// Authentication service
builder.Services.AddJWTBearerAuthentication(builder.Configuration);
// Authorization service 
builder.Services.AddAuthorization(options =>
{
    // Add policies
    options.AddAuthorizationPolicies(); 
});


// Web app services 
builder.Services.AddPlannerServices();

// Email services
builder.Services.AddEmailServices(builder.Configuration); 

// App configurations 
builder.Services.AddAppConfigurations(builder.Configuration);

// Global Exception handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

// Apply migrations
using (var scope = app.Services.CreateScope())
{
    try
    {
        var database = scope.ServiceProvider.GetRequiredService<PlannerContext>();
        await database.Database.MigrateAsync();
        await DbInitializer.SeenAsync(database); 
    }
    catch (Exception ex)
    {
        Log.Fatal(ex, "Database migration failed.");
        throw; 
    }
}

app.UseExceptionHandler();

if (app.Environment.IsProduction())
{
    app.UseSerilogRequestLogging(); 
}

// Map signalR Hubs
app.MapPlannerHubs();


// Configure the HTTP request pipeline.

if (app.Environment.IsProduction())
{
    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders =
            ForwardedHeaders.XForwardedFor |
            ForwardedHeaders.XForwardedProto |
            ForwardedHeaders.XForwardedHost,
    });
}

//app.UseHttpsRedirection();

string corsPolicyName = builder.Configuration["CorsPolicy:PolicyName"] ??
    throw new InvalidOperationException("Failed to get Cors policy name");

app.UseCors(corsPolicyName);


app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
