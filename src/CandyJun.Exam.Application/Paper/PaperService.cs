using CandyJun.Exam.Paper.Dto;
using Creekdream.Application.Service.Dto;
using Creekdream.Mapping;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandyJun.Exam.Paper
{
    /// <summary>
    /// 试卷服务类型
    /// </summary>
    public class PaperService : BaseService
    {
        private readonly IBaseRepository<Papers> _repository;

        /// <summary>
        /// 
        /// </summary>
        public PaperService(IBaseRepository<Papers> repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// 添加试卷
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PaperOutput> Add(PaperInput input)
        {
            var entity = input.MapTo<Papers>();
            entity = await _repository.InsertAsync(entity);

            return entity.MapTo<PaperOutput>();
        }

        /// <summary>
        /// 更新试卷
        /// </summary>
        /// <param name="id"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PaperOutput> Update(int id, PaperInput input)
        {
            var entity = input.MapTo<Papers>();
            entity.Id = id;
            entity = await _repository.UpdateAsync(entity);

            return entity.MapTo<PaperOutput>();
        }

        /// <summary>
        /// 根据Id查询试卷
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<PaperOutput> Get(int id)
        {
            var entity = await _repository.GetAsync(id);

            return entity.MapTo<PaperOutput>();
        }

        /// <summary>
        /// 查询试卷
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultOutput<PaperOutput>> Get(GetPaperInput input)
        {
            var query = _repository.GetAllInclude();
            if (!string.IsNullOrEmpty(input.Name))
            {
                query = query.Where(w => w.Name.Contains(input.Name));
            }
            if (input.DifficultyLevel.HasValue)
            {
                query = query.Where(w => w.DifficultyLevel == input.DifficultyLevel);
            }

            return await GetWithAuditTime<Papers, PaperOutput>(query, input);
        }
    }
}
