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
    public async Task<IActionResult> GetNotes(int pageNumber = 1, int pageSize = 10)
    {
        var notes = await _context.Notes
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Json(notes);
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

                startMonth = 1 * quarter.Value;
                endMonth = 3 * quarter.Value;


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

        var totalBillingCompleted = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate && n.Status == NoteStatus.BillingCompleted)
            .SumAsync(n => n.NoteValue);

        var totalIssued = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate && n.Status == NoteStatus.Issued)
            .SumAsync(n => n.NoteValue);

        var totalPaymentOverdue = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate && n.Status == NoteStatus.PaymentOverdue)
            .SumAsync(n => n.NoteValue);

        var totalBillingCompletedAndIssued = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate &&
                        (n.Status == NoteStatus.BillingCompleted || n.Status == NoteStatus.Issued))
            .SumAsync(n => n.NoteValue);

        var totalPaymentCompleted = await _context.Notes
            .Where(n => n.IssueDate >= startDate && n.IssueDate <= endDate && n.Status == NoteStatus.PaymentCompleted)
            .SumAsync(n => n.NoteValue);


        var indicators = new
        {
            totalEmitidas = totalBillingCompleted, //Emitidas (com cobrança)
            semCobranca = totalIssued, //Emitidas (sem cobrança)
            inadimplencia = totalPaymentOverdue, // Vencidas
            aVencer = totalBillingCompletedAndIssued, //A vencer (Emitidas c/s cobrança...)
            Pagas = totalPaymentCompleted // Pagas
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
