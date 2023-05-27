using Microsoft.EntityFrameworkCore;
using MovieLibrary___API.Models;

namespace MovieLibrary___API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }

        public DbSet<Movie> movies { get; set; }
    }
}
