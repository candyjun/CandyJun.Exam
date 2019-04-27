using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Topic
{
    /// <summary>
    /// 
    /// </summary>
    public class TopicAnswerChoiceService : BaseService
    {
        private readonly IBaseRepository<TopicAnswerChoices> _repository;
        /// <summary>
        /// 
        /// </summary>
        public TopicAnswerChoiceService(IBaseRepository<TopicAnswerChoices> repository)
        {
            _repository = repository;
        }
    }
}
