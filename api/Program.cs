using EcologySimulation.Core.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSingleton<TerrainService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: "development", policy =>
        {
            policy.WithOrigins("http://localhost:5025")
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("development");
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
