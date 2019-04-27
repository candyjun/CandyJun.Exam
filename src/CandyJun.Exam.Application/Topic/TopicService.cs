using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Topic
{
    /// <summary>
    /// 题目
    /// </summary>
    public class TopicService : BaseService
    {
        private readonly IBaseRepository<Topics> _repository;
        /// <summary>
        /// 
        /// </summary>
        public TopicService(IBaseRepository<Topics> repository)
        {
            _repository = repository;
        }
    }
}
