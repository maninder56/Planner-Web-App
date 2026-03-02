using DatabaseContext;
using Microsoft.EntityFrameworkCore;
using API.ServiceRegistrationExtensions; 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

// Add database services
builder.Services.AddDatabaseService(builder.Configuration);



// CORS Policy
builder.Services.AddCorsPolicy(builder.Configuration); 

// Authentication service
builder.Services.AddJWTBearerAuthentication(builder.Configuration);
// Authorization service 
builder.Services.AddAuthorization(); 


// Web app services 
builder.Services.AddPlannerServices();

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


app.UseAuthorization();
app.UseAuthorization(); 

app.MapControllers();

app.Run();
