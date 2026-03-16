using DatabaseContext;
using DatabaseContext.Types; 
using Microsoft.EntityFrameworkCore;
using API.ServiceRegistrationExtensions;
using API.Handler;
using System.Text.Json.Serialization;
using API.Policies.Requirements;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    // Add json convertor for enum values
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());   
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddProblemDetails();

// Add database services
builder.Services.AddDatabaseService(builder.Configuration);



// CORS Policy
builder.Services.AddCorsPolicy(builder.Configuration); 

// Authentication service
builder.Services.AddJWTBearerAuthentication(builder.Configuration);
// Authorization service 
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(
        "CanEditBoard",
        policyBuilder => policyBuilder.AddRequirements(
            new BoardEditRequirement(Role.Owner, Role.Member)
            ));

    options.AddPolicy(
        "CanDeleteBoard",
        policyBuilder => policyBuilder.AddRequirements(
            new BoardDeleteRequirement(Role.Owner)
            )); 
});


// Web app services 
builder.Services.AddPlannerServices();


// Global Exception handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

// Apply migrations
using var scope = app.Services.CreateScope();
var database = scope.ServiceProvider.GetRequiredService<PlannerContext>(); 
database.Database.Migrate();
database.SaveChanges();
database.Dispose(); 
scope.Dispose();

app.UseExceptionHandler();
app.UseStatusCodePages();


// Configure the HTTP request pipeline.

//app.UseHttpsRedirection();

string corsPolicyName = builder.Configuration["CorsPolicy:PolicyName"] ??
    throw new InvalidOperationException("Failed to get Cors policy name");

app.UseCors(corsPolicyName);


app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
