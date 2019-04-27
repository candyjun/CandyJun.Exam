using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Paper
{
    /// <summary>
    /// 
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
    }
}
