using CandyJun.Exam.Books;
using Microsoft.EntityFrameworkCore;
using Creekdream.Orm.EntityFrameworkCore;
using CandyJun.Exam.Paper;
using CandyJun.Exam.Sheet;
using CandyJun.Exam.Topic;
using CandyJun.Exam.User;
using System.Linq.Expressions;

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //添加全局过滤器，用于过滤软删除的数据
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(IHasSoftDelete).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = Expression.Parameter(entityType.ClrType);
                    var body = Expression.Equal(Expression.Property(parameter, nameof(IHasSoftDelete.IsDeleted)), Expression.Constant(false));
                    var expression = Expression.Lambda(body, parameter);
                    modelBuilder.Entity(entityType.ClrType).HasQueryFilter(expression);
                }
            }

            base.OnModelCreating(modelBuilder);
        }

        /// <summary>
        /// Books
        /// </summary>
        public DbSet<Book> Books { get; set; }
        public DbSet<Papers> Papers { get; set; }
        public DbSet<PaperTopics> PaperTopics { get; set; }
        public DbSet<Sheets> Sheets { get; set; }
        public DbSet<TopicAnswerChoices> TopicAnswerChoices { get; set; }
        public DbSet<TopicChoices> TopicChoices { get; set; }
        public DbSet<Topics> Topics { get; set; }
        public DbSet<Users> Users { get; set; }
    }
}

