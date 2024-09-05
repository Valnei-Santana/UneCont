using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UneCont.Data;

namespace UneCont.Controllers
{
    public abstract class BaseController : Controller
    {
        protected readonly ApplicationDbContext _context;
        protected readonly ILogger<BaseController> _logger;

        protected BaseController(ApplicationDbContext context, ILogger<BaseController> logger)
        {
            _context = context;
            _logger = logger;
        }
    }
}