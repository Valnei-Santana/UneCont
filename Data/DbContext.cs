using Microsoft.EntityFrameworkCore;
using UneCont.Models;

namespace UneCont.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<NoteModel> Notes { get; set; } 
    }
}