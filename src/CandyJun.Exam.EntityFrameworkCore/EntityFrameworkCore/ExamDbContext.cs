using CandyJun.Exam.Books;
using Microsoft.EntityFrameworkCore;
using Creekdream.Orm.EntityFrameworkCore;

namespace CandyJun.Exam.EntityFrameworkCore
{
    /// <summary>
    /// Exam database access context
    /// </summary>
    public class ExamDbContext : DbContextBase
    {
        public ExamDbContext(DbContextOptions<ExamDbContext> options)
            : base(options)
        {

        }

        /// <summary>
        /// Books
        /// </summary>
        public DbSet<Book> Books { get; set; }
    }
}

