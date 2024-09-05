using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using UneCont.Data;
using UneCont.Models;

namespace UneCont.Controllers;

public class DashboardController : BaseController
{

    public DashboardController(ApplicationDbContext context, ILogger<NotesController> logger)
         : base(context, logger)
    {
    }

    public IActionResult Index()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
