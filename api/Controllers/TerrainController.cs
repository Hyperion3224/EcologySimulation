using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class TerrainController: ControllerBase
{

    [HttpGet(Name = "GetTerrain")]
    public Task Get()
    {
       return Ok(); 
    }
}
