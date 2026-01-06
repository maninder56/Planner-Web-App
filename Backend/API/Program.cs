using DatabaseContext;
using Microsoft.EntityFrameworkCore;
using API.ServiceRegistrationExtensions; 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Add database services
builder.Services.AddDatabaseService(builder.Configuration); 


var app = builder.Build();

// Apply migrations
using var scope = app.Services.CreateScope();
var database = scope.ServiceProvider.GetRequiredService<PlannerContext>(); 
database.Database.Migrate();
database.SaveChanges();
database.Dispose(); 
scope.Dispose();


// Configure the HTTP request pipeline.

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
