using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Topic
{
    /// <summary>
    /// 
    /// </summary>
    public class TopicChoiceService : BaseService
    {
        private readonly IBaseRepository<TopicChoices> _repository;
        /// <summary>
        /// 
        /// </summary>
        public TopicChoiceService(IBaseRepository<TopicChoices> repository)
        {
            _repository = repository;
        }
    }
}
