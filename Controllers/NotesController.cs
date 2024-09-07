using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using UneCont.Data;
using UneCont.Models;
using Microsoft.EntityFrameworkCore;

namespace UneCont.Controllers;

public class NotesController : BaseController
{
    public NotesController(ApplicationDbContext context, ILogger<NotesController> logger)
            : base(context, logger)
    {
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpGet("notes/list")]
    public async Task<IActionResult> GetNotes(DateTime? issueDate = null, DateTime? billingDate = null, DateTime? paymentDate = null, int? status = null, int pageNumber = 1, int pageSize = 10)
    {
        var query = _context.Notes.AsQueryable();

        if (issueDate.HasValue)
        {
            query = query.Where(n => n.IssueDate.Date == issueDate.Value.Date);
        }

        if (billingDate.HasValue)
        {
            query = query.Where(n =>  n.BillingDate.HasValue && n.BillingDate.Value.Date == billingDate.Value.Date);
        }

        if (paymentDate.HasValue)
        {
            query = query.Where(n => n.PaymentDate.HasValue && n.PaymentDate.Value.Date == paymentDate.Value.Date);
        }

        if (status.HasValue)
        {
            query = query.Where(n => (int)n.Status == status.Value);
        }

        var total = await query.CountAsync();

        var notes = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var lastPage = (int)Math.Ceiling(total / (double)pageSize);

        return Json(new
        {
            total,
            lastPage,
            pageSize,
            data = notes
        });
    }

    [HttpGet("notes/indicators")]
    public async Task<IActionResult> GetIndicators(string filter = null, int? year = 2023, int? quarter = 1, int? month = 1)
    {
        DateTime startDate;
        DateTime endDate;

        var now = DateTime.Now;

        switch (filter?.ToLower())
        {
            case "quarter":
                int startMonth;
                int endMonth;

                if (!quarter.HasValue || quarter.Value < 1 || quarter.Value > 4)
                    throw new ArgumentException("Semestre precisa ser entre 1 e 4!");

                startMonth = (quarter.Value - 1) * 3 + 1; // Calcula o mês de início (1, 4, 7, 10)
                endMonth = startMonth + 2;

                startDate = new DateTime(year ?? now.Year, startMonth, 1);
                endDate = new DateTime(year ?? now.Year, endMonth, DateTime.DaysInMonth(year ?? now.Year, endMonth)).AddTicks(-1);
                break;

            case "year":
                startDate = new DateTime(year ?? now.Year, 1, 1);
                endDate = new DateTime(year ?? now.Year, 12, 31, 23, 59, 59, 999);
                break;

            default:
                //Por mês
                startDate = new DateTime(year ?? now.Year, month ?? now.Month, 1);
                endDate = startDate.AddMonths(1).AddTicks(-1);
                break;
        }

        var totalEmitidasGeral = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate)
            .SumAsync(n => n.NoteValue); // Total emitidas

        var totalSemCobranca = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate && n.Status == NoteStatus.Issued)
            .SumAsync(n => n.NoteValue); //Total emitidas sem cobrança

        var totalVencidas = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate && n.Status == NoteStatus.PaymentOverdue)
            .SumAsync(n => n.NoteValue);

        var totalAVencer = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate &&
                        (n.Status == NoteStatus.BillingCompleted || n.Status == NoteStatus.Issued))
            .SumAsync(n => n.NoteValue); // A vencer
            
        var totalPagas = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate && n.Status == NoteStatus.PaymentCompleted)
            .SumAsync(n => n.NoteValue); //Pagas


        var indicators = new
        {
            totalEmitidas = totalEmitidasGeral, //Emitidas
            semCobranca = totalSemCobranca, //Emitidas (sem cobrança)
            inadimplencia = totalVencidas, // Vencidas
            aVencer = totalAVencer, //A vencer (Emitidas c/s cobrança...)
            Pagas = totalPagas // Pagas
        };

        return Json(indicators);
    }

    [HttpGet("notes/graphic")]
    public async Task<IActionResult> GetGraphicPerMonth(string type = "receita", int? year = null)
    {
        int currentYear = year ?? DateTime.Now.Year;

        DateTime startDate = new DateTime(currentYear, 1, 1);
        DateTime endDate = new DateTime(currentYear, 12, 31, 23, 59, 59, 999);

        if (currentYear == DateTime.Now.Year)
            endDate = new DateTime(currentYear, DateTime.Now.Month, DateTime.DaysInMonth(currentYear, DateTime.Now.Month), 23, 59, 59, 999);

        NoteStatus statusFilter;

        switch (type.ToLower())
        {
            case "receita":
                statusFilter = NoteStatus.PaymentCompleted;
                break;
            default:
                statusFilter = NoteStatus.PaymentOverdue;
                break;
        }

        var data = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate && n.Status == statusFilter)
            .GroupBy(n => new { n.IssueDate.Year, n.IssueDate.Month })
            .Select(g => new
            {
                Month = g.Key.Month,
                TotalValue = g.Sum(n => n.NoteValue)
            })
            .OrderBy(x => x.Month)
            .ToListAsync();

        var categories = new List<string>();
        var values = new List<decimal>();
        Boolean isCurrentYear = currentYear == DateTime.Now.Year;
        for (int month = 1; month <= (isCurrentYear ? DateTime.Now.Month : 12); month++)
        {
            var monthName = new DateTime(currentYear, month, 1).ToString("MMM", new System.Globalization.CultureInfo("pt-BR"));
            categories.Add(monthName);
            var monthData = data.FirstOrDefault(d => d.Month == month);
            values.Add(monthData != null ? monthData.TotalValue : 0);
        }

        var result = new
        {
            data = values,
            categories = categories
        };

        return Json(result);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
