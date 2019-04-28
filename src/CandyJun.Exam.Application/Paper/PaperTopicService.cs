using CandyJun.Exam.Paper.Dto;
using Creekdream.Application.Service.Dto;
using Creekdream.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CandyJun.Exam.Paper
{
    /// <summary>
    /// 试卷题目服务类
    /// </summary>
    public class PaperTopicService : BaseService
    {
        private readonly IBaseRepository<PaperTopics> _repository;

        /// <summary>
        /// 
        /// </summary>
        public PaperTopicService(IBaseRepository<PaperTopics> repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// 添加试卷题目关系
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PaperTopicOutput> Add(PaperTopicInput input)
        {
            var entity = input.MapTo<PaperTopics>();
            entity = await _repository.InsertAsync(entity);

            return entity.MapTo<PaperTopicOutput>();
        }

        /// <summary>
        /// 根据试卷Id添加试卷题目关系
        /// </summary>
        /// <param name="paperId"></param>
        /// <param name="topicIds"></param>
        /// <returns></returns>
        public async Task<List<PaperTopicOutput>> AddByPaper(int paperId, List<int> topicIds)
        {
            var entitys = topicIds.Select(topicId => new PaperTopics()
            {
                PaperId = paperId,
                TopicId = topicId
            }).ToList();
            for (var i = 0; i < entitys.Count; i++)
            {
                entitys[i] = await _repository.InsertAsync(entitys[i]);
            }
            return entitys.MapTo<List<PaperTopicOutput>>();
        }

        /// <summary>
        /// 更新试卷题目关系
        /// </summary>
        /// <param name="id"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PaperTopicOutput> Update(int id, PaperTopicInput input)
        {
            var entity = input.MapTo<PaperTopics>();
            entity.Id = id;
            entity = await _repository.UpdateAsync(entity);

            return entity.MapTo<PaperTopicOutput>();
        }

        /// <summary>
        /// 根据试卷Id更新试卷题目关系
        /// </summary>
        /// <param name="paperId"></param>
        /// <param name="topicIds"></param>
        /// <returns></returns>
        public async Task<List<PaperTopicOutput>> UpdateByPaperId(int paperId, List<int> topicIds)
        {
            await _repository.DeleteAsync(w => w.PaperId == paperId);

            return await AddByPaper(paperId, topicIds);
        }

        /// <summary>
        /// 根据Id查询试卷题目关系
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<PaperTopicOutput> Get(int id)
        {
            var entity = await _repository.GetAsync(id);

            return entity.MapTo<PaperTopicOutput>();
        }

        /// <summary>
        /// 根据试卷Id查询试卷题目关系
        /// </summary>
        /// <param name="paperId"></param>
        /// <returns></returns>
        public async Task<List<PaperTopicOutput>> GetByPaperId(int paperId)
        {
            var entitys = await _repository.GetListAsync(w => w.PaperId == paperId);

            return entitys.MapTo<List<PaperTopicOutput>>();
        }

        /// <summary>
        /// 查询试卷题目关系
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultOutput<PaperTopicOutput>> Get(GetPaperTopicInput input)
        {
            var query = _repository.GetAllInclude();
            if (input.PaperId.HasValue)
            {
                query = query.Where(w => w.PaperId == input.PaperId);
            }
            if (input.TopicId.HasValue)
            {
                query = query.Where(w => w.TopicId == input.TopicId);
            }

            return await GetWithAuditTime<PaperTopics, PaperTopicOutput>(query, input);
        }
    }
}
