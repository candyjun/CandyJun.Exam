using CandyJun.Exam.Api.Filters;
using CandyJun.Exam.Api.Middlewares;
using CandyJun.Exam.EntityFrameworkCore;
using CandyJun.Exam.Exceptions;
using CandyJun.Exam.Migrations;
using Creekdream.AspNetCore;
using Creekdream.Dependency;
using Creekdream.Mapping;
using Creekdream.Orm;
using Creekdream.Orm.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.IO;
using System.Linq;

namespace CandyJun.Exam.Api
{
    /// <inheritdoc />
    public class Startup
    {
        private readonly IConfiguration _configuration;

        /// <inheritdoc />
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        /// </summary>
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(
                options =>
                {
                    options.Filters.Add(typeof(CustomExceptionFilter));
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            var connectionString = _configuration.GetConnectionString("Default");
            var csb = new MySql.Data.MySqlClient.MySqlConnectionStringBuilder(connectionString);
            var maximumPoolSize = (int)csb.MaximumPoolSize;
            services.AddDbContext<DbContextBase, ExamDbContext>(
                options =>
                {
                    options.UseMySql(connectionString, mySqlOptionsAction =>
                    {
                        mySqlOptionsAction.ServerVersion(new Version(5, 6, 16),
                            Pomelo.EntityFrameworkCore.MySql.Infrastructure.ServerType.MySql);
                    });
                });
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory =
                    actionContext =>
                    {
                        var userFriendlyException = new UserFriendlyException(
                            ErrorCode.UnprocessableEntity,
                            "参数输入不正确");
                        actionContext.ModelState
                            .Where(e => e.Value.Errors.Count > 0).ToList()
                            .ForEach(
                                e =>
                                {
                                    userFriendlyException.Errors.Add(e.Key, e.Value.Errors.Select(v => v.ErrorMessage));
                                });
                        throw userFriendlyException;
                    };
            });
            services.AddSwaggerGen(
                options =>
                {
                    options.SwaggerDoc("v1", new Info { Version = "v1", Title = "Exam API" });
                    var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
                    options.IncludeXmlComments(Path.Combine(baseDirectory, "CandyJun.Exam.Application.xml"));
                    options.IncludeXmlComments(Path.Combine(baseDirectory, "CandyJun.Exam.Api.xml"));
                });

            return services.AddCreekdream(
                options =>
                {
                    options.UseWindsor();
                    options.UseEfCore();
                    options.AddExamCore();
                    options.AddExamEfCore();
                    options.AddExamApplication();
                });
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseCreekdream(
                options =>
                {
                    options.UseAutoMapper();
                });

            SeedData.Initialize(app.ApplicationServices).Wait();
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseHttpsRedirection();
            app.UseRequestLog();
            app.UseStaticFiles();
            app.UseSwagger();
            app.UseSwaggerUI(
                c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "简单示例项目API");
                });
            app.UseMvc();
        }
    }
}

