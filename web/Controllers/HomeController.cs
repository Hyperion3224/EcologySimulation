using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using EcologySimulation.Models;
using EcologySimulation.Core.Service;

namespace web.Controllers;

public class HomeController : Controller
{
    private readonly TerrainService _terrainService;
    public HomeController(TerrainService terrainService)
    {
        _terrainService = terrainService;
    }

    public IActionResult Index(string seed, int height, int diameter, int chunk)
    {
      var model = new HomeModel {};
      if(!string.IsNullOrEmpty(seed)) model.Seed = seed;
      if(height != 0) model.Height = height;
      if(diameter != 0) model.Diameter = diameter;
      if(chunk != 0) model.ChunkSize = chunk;

      model.Data = _terrainService.GenerateTerrain(model.Seed, model.Height, model.Diameter, model.ChunkSize);

      return View( model );
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
