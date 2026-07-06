using API.Models.Board;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace API.Services.GuestService; 

public class GuestDataService
{
    private ILogger<GuestDataService> logger;
    public readonly GuestBoard GuestBoardData; 

    public GuestDataService(ILogger<GuestDataService> logger)
    {
        this.logger = logger;

        var path = Path.Combine(AppContext.BaseDirectory, "Data", "GuestBoardData.json"); 

        var json = File.ReadAllText(path);

        var options = new JsonSerializerOptions
        {
            Converters = { new JsonStringEnumConverter() }, 
            PropertyNameCaseInsensitive = true,
        }; 

        GuestBoardData = JsonSerializer.Deserialize<GuestBoard>(json, options)
            ?? throw new Exception("Failed to load GuestBoardData.json");
    }
}