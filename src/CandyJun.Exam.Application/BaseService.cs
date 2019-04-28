using CandyJun.Exam.Dto;
using Creekdream.Application.Service;
using Creekdream.Application.Service.Dto;
using Creekdream.Mapping;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace CandyJun.Exam
{
    /// <summary>
    /// 服务层基类
    /// </summary>
    public class BaseService : ApplicationService
    {
        /// <summary>
        /// 添加时间查询条件并获取分页查询结果
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TDestination"></typeparam>
        /// <param name="query"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        protected async Task<PagedResultOutput<TDestination>> GetWithAuditTime<TSource, TDestination>(IQueryable<TSource> query, GetInput input) where TSource : BaseEntity
        {
            if (input.CreationTimeBegin.HasValue)
            {
                query = query.Where(w => w.CreationTime >= input.CreationTimeBegin);
            }
            if (input.CreationTimeEnd.HasValue)
            {
                query = query.Where(w => w.CreationTime <= input.CreationTimeEnd);
            }
            if (input.LastModificationTimeBegin.HasValue)
            {
                query = query.Where(w => w.LastModificationTime >= input.LastModificationTimeBegin);
            }
            if (input.LastModificationTimeEnd.HasValue)
            {
                query = query.Where(w => w.LastModificationTime <= input.LastModificationTimeEnd);
            }

            return await GetPagedResult<TSource, TDestination>(query, input);
        }

        /// <summary>
        /// 获取分页查询结果
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TDestination"></typeparam>
        /// <param name="query"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        protected async Task<PagedResultOutput<TDestination>> GetPagedResult<TSource, TDestination>(IQueryable<TSource> query, PagedAndSortedResultInput input)
        {
            var totalCount = await query.CountAsync();
            var entitys = await query.OrderBy(input.Sorting)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToListAsync();

            return new PagedResultOutput<TDestination>()
            {
                TotalCount = totalCount,
                Items = entitys.MapTo<List<TDestination>>()
            };

        }
    }
}
