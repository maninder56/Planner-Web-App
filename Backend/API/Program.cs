using DatabaseContext;
using Microsoft.EntityFrameworkCore; 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

//string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
//            ?? throw new InvalidOperationException("Unable to find database connection");

//builder.Services.AddDbContext<PlannerContext>(options =>
//    options.UseMySql(
//        connectionString,

//        b => b.MigrationsAssembly("DatabaseContext"))); 

var app = builder.Build();

// Configure the HTTP request pipeline.


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
