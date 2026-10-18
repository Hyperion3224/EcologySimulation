using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using EcologySimulation.Models;

namespace web.Controllers;

public class HomeController : Controller
{
    public IActionResult Index(string seed, int height, int diameter)
    {
      var model = new HomeModel {};
      if(!string.IsNullOrEmpty(seed)) model.Seed = seed;
      if(height != 0) model.Height = height;
      if(diameter != 0) model.Diameter = diameter;

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
