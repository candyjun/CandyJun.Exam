using CandyJun.Exam.Books;
using CandyJun.Exam.EntityFrameworkCore;
using CandyJun.Exam.User;
using CandyJun.Exam.Utility;
using Creekdream.Orm.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace CandyJun.Exam.Migrations
{
    /// <summary>
    /// Initialize the data required by the application
    /// </summary>
    public class SeedData
    {
        /// <inheritdoc />
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = scope.ServiceProvider.GetService<DbContextBase>() as ExamDbContext;
                context.Database.Migrate();

                if (await context.Books.CountAsync() < 100)
                {
                    for (int i = 0; i < 100; i++)
                    {
                        var book = new Book
                        {
                            Name = $"Book-{i}",
                            CreationTime = DateTime.Now
                        };
                        await context.Books.AddAsync(book);
                    }

                    await context.SaveChangesAsync();
                }

                if (await context.Users.CountAsync() < 1)
                {
                    var user = new Users
                    {
                        Name = $"admin",
                        NickName = "超级管理员",
                        Password = "admin",
                        OpenId = Guid.NewGuid().ToString("X"),
                        CreationTime = DateTime.Now
                    };
                    user.GenerateSalt();
                    user.HashPassword();

                    await context.Users.AddAsync(user);

                    await context.SaveChangesAsync();
                }
            }
        }
    }
}

