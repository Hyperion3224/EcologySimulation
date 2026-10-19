using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using EcologySimulation.Core.Service;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TerrainController: ControllerBase
{
    private readonly TerrainService _terrainService;
    public TerrainController(TerrainService terrainService){
        _terrainService = terrainService;
    }

    [HttpGet("GetTerrain")]
    public IActionResult Get(string seed, int worldHeight, int worldChunkDiameter, int chunkSize)
    {
        if(string.IsNullOrEmpty(seed) || worldHeight <=0 || worldChunkDiameter <= 0 || chunkSize <= 0)
        {
            return BadRequest("Incorrect params passed for terrain generation");
        }

        var result = JsonSerializer.Serialize(_terrainService.GenerateTerrain(seed, worldHeight, worldChunkDiameter, chunkSize));
        
       return Ok(result); 
    }
}
